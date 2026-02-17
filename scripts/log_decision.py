#!/usr/bin/env python3
"""
Decision Logger

Standalone script for logging structured decisions during brainstorming,
alignment, and implementation sessions. Zero external dependencies (stdlib only).
Works in both the main contracts repo and campaign repos.

Usage:
    # CLI args (simple decisions)
    python scripts/log_decision.py \
      --category architecture \
      --summary "Chose FastAPI over Flask" \
      --reasoning "Built-in async, auto OpenAPI docs"

    # Stdin JSON (complex decisions, avoids quoting issues)
    python scripts/log_decision.py --stdin <<'DECISION'
    {"category": "architecture", "summary": "Chose FastAPI over Flask", ...}
    DECISION
"""

import argparse
import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


def find_campaign_config(start_dir=None):
    """Walk up from start_dir looking for .campaign.json. Returns parsed dict or None."""
    current = Path(start_dir or os.getcwd()).resolve()
    for _ in range(10):  # safety limit
        candidate = current / ".campaign.json"
        if candidate.exists():
            try:
                return json.loads(candidate.read_text(encoding="utf-8")), current
            except (json.JSONDecodeError, OSError):
                pass
        parent = current.parent
        if parent == current:
            break
        current = parent
    return None, None


def resolve_output_dir(campaign_id=None, campaign_root=None, contracts_root=None):
    """Determine where to write decision files.

    All decisions go to the main contracts repo:
    Campaign decisions: {contracts_root}/logs/decisions/{campaign_id}/
    System decisions: logs/decisions/system/
    """
    if campaign_id and contracts_root:
        out = Path(contracts_root) / "logs" / "decisions" / str(campaign_id)
    elif campaign_id and campaign_root:
        # Fallback: write locally if contracts_root not configured
        out = Path(campaign_root) / "logs" / "decisions"
    else:
        # Main repo: look for logs/decisions/system/ relative to script or cwd
        script_dir = Path(__file__).resolve().parent.parent
        system_dir = script_dir / "logs" / "decisions" / "system"
        if system_dir.parent.exists():
            out = system_dir
        else:
            out = Path("logs") / "decisions" / "system"
    out.mkdir(parents=True, exist_ok=True)
    return out


def next_sequence(output_dir, date_str):
    """Find the next sequence number for today's date in the output directory."""
    existing = list(output_dir.glob(f"{date_str}-*"))
    return len(existing) + 1


def build_record(data, campaign_id=None):
    """Build a full decision record matching the decision-log-v1 schema."""
    now = datetime.now(timezone.utc)

    # Normalize alternatives to a list
    alternatives = data.get("alternatives", [])
    if isinstance(alternatives, str):
        alternatives = [a.strip() for a in alternatives.split(",") if a.strip()]

    # Normalize tags
    tags = data.get("tags", [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]

    record = {
        "$schema": "decision-log-v1",
        "id": str(uuid.uuid4()),
        "timestamp": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "campaign_id": campaign_id,
        "phase": data.get("phase") or ("system" if not campaign_id else "kanban-1"),
        "step": data.get("step") or "",

        "category": data.get("category", "process"),
        "subcategory": data.get("subcategory", ""),

        "decision": {
            "summary": data.get("summary", ""),
            "detail": data.get("detail", ""),
        },

        "context": {
            "what_was_proposed": data.get("proposed", ""),
            "what_you_changed": data.get("changed", ""),
            "alternatives_considered": alternatives,
            "constraints": {
                "deadline": data.get("deadline"),
                "budget": data.get("budget"),
                "requirements": data.get("requirements", []),
                "other": data.get("constraints_other"),
            },
            "documents_referenced": data.get("documents", []),
            "prior_decisions": data.get("prior_decisions", []),
        },

        "reasoning": {
            "primary": data.get("reasoning", ""),
            "factors": data.get("factors", []),
            "tradeoffs": data.get("tradeoffs", ""),
        },

        "actor": data.get("actor", "collaborative"),
        "human_override": data.get("human_override", False),
        "confidence": data.get("confidence", "medium"),

        "outcome": {
            "result": "pending",
            "observed_at": None,
            "notes": None,
            "would_do_differently": None,
        },

        "metadata": {
            "session_id": data.get("session_id"),
            "model": data.get("model"),
            "tags": tags,
        },
    }
    return record, now


def try_api_sync(record, api_url, campaign_id):
    """Best-effort sync to dashboard API. Returns True on success."""
    if not api_url or not campaign_id:
        return False
    try:
        url = f"{api_url}/campaigns/{campaign_id}/decisions"
        body = json.dumps(record).encode("utf-8")
        req = Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
        with urlopen(req, timeout=5) as resp:
            return resp.status < 400
    except (URLError, HTTPError, OSError, Exception):
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Log a structured decision to logs/decisions/",
        prog="log_decision.py",
    )

    # Input mode
    parser.add_argument("--stdin", action="store_true",
                        help="Read decision as JSON from stdin")

    # CLI arg fields
    parser.add_argument("--category", help="Decision category (architecture, scope, ui-ux, implementation, process, etc.)")
    parser.add_argument("--summary", help="One-line decision summary")
    parser.add_argument("--reasoning", help="Primary reason for this choice")
    parser.add_argument("--proposed", help="What was originally proposed")
    parser.add_argument("--changed", help="What was changed from the proposal")
    parser.add_argument("--detail", help="Detailed description of the decision")
    parser.add_argument("--alternatives", help="Comma-separated list of alternatives considered")
    parser.add_argument("--subcategory", help="Finer classification within category")
    parser.add_argument("--confidence", choices=["high", "medium", "low"], default="medium")
    parser.add_argument("--human-override", action="store_true", help="Human changed agent recommendation")
    parser.add_argument("--phase", help="Workflow phase")
    parser.add_argument("--step", help="Step within the phase")
    parser.add_argument("--actor", choices=["human", "agent", "collaborative"], default="collaborative")
    parser.add_argument("--tags", help="Comma-separated tags")
    parser.add_argument("--tradeoffs", help="What was sacrificed for this choice")
    parser.add_argument("--factors", help="Comma-separated contributing factors")

    # Context override
    parser.add_argument("--campaign-id", help="Explicit campaign ID (overrides auto-detection)")

    args = parser.parse_args()

    # Build data dict from stdin or CLI args
    if args.stdin:
        try:
            raw = sys.stdin.read()
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON on stdin: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        if not args.category or not args.summary:
            print("Error: --category and --summary are required (or use --stdin)", file=sys.stderr)
            sys.exit(1)

        factors = []
        if args.factors:
            factors = [f.strip() for f in args.factors.split(",") if f.strip()]

        data = {
            "category": args.category,
            "summary": args.summary,
            "reasoning": args.reasoning or "",
            "proposed": args.proposed or "",
            "changed": args.changed or "",
            "detail": args.detail or "",
            "alternatives": args.alternatives or "",
            "subcategory": args.subcategory or "",
            "confidence": args.confidence,
            "human_override": args.human_override,
            "phase": args.phase or "",
            "step": args.step or "",
            "actor": args.actor,
            "tags": args.tags or "",
            "tradeoffs": args.tradeoffs or "",
            "factors": factors,
        }

    # Resolve campaign context
    campaign_id = args.campaign_id if hasattr(args, "campaign_id") and args.campaign_id else data.get("campaign_id")
    campaign_config, campaign_root = None, None

    if not campaign_id:
        campaign_config, campaign_root = find_campaign_config()
        if campaign_config:
            campaign_id = campaign_config.get("campaign_id")

    # Build record
    record, now = build_record(data, campaign_id)
    date_str = now.strftime("%Y-%m-%d")

    # Write to main contracts repo (via contracts_root) or fall back to local
    contracts_root = campaign_config.get("contracts_root") if campaign_config else None
    output_dir = resolve_output_dir(campaign_id, campaign_root, contracts_root)
    seq = next_sequence(output_dir, date_str)
    category_slug = record["category"]
    filename = f"{date_str}-{seq:03d}-{category_slug}.json"
    filepath = output_dir / filename

    filepath.write_text(json.dumps(record, indent=2), encoding="utf-8")

    # Best-effort API sync
    api_url = None
    if campaign_config:
        api_url = campaign_config.get("api_url")
    synced = try_api_sync(record, api_url, campaign_id) if api_url else False

    # Output
    sync_note = " (synced to API)" if synced else ""
    print(f"Logged: {filepath}{sync_note}")


if __name__ == "__main__":
    main()
