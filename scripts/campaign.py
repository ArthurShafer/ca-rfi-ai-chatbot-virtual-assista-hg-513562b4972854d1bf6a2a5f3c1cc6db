#!/usr/bin/env python3
"""
Campaign Bridge CLI

Zero-dependency Python script connecting a campaign repo to the dashboard API.
Commands: status, advance, log-decision, sync, push-deliverables

Usage:
    python scripts/campaign.py status
    python scripts/campaign.py advance [--to LANE] [--force]
    python scripts/campaign.py log-decision --category architecture --summary "..." [--reasoning "..."]
    python scripts/campaign.py sync
    python scripts/campaign.py push-deliverables [--source auto_advance] [--notes "..."]
"""

import argparse
import json
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

LANE_ORDER = ["backlog", "scoping", "development", "testing", "ready"]

def load_config():
    """Load .campaign.json from repo root."""
    config_path = Path(".campaign.json")
    if not config_path.exists():
        # Try parent directories
        for parent in Path.cwd().parents:
            candidate = parent / ".campaign.json"
            if candidate.exists():
                config_path = candidate
                break
    if not config_path.exists():
        print("Error: No .campaign.json found. Is this a campaign repo?", file=sys.stderr)
        sys.exit(1)
    return json.loads(config_path.read_text(encoding="utf-8"))

def api_request(url, method="GET", data=None, timeout=5):
    """Make an HTTP request. Returns (response_dict, error_string)."""
    try:
        headers = {"Content-Type": "application/json"}
        body = json.dumps(data).encode("utf-8") if data else None
        req = Request(url, data=body, headers=headers, method=method)
        with urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8")), None
    except HTTPError as e:
        try:
            detail = json.loads(e.read().decode("utf-8"))
            return None, f"HTTP {e.code}: {detail.get('detail', str(detail))}"
        except Exception:
            return None, f"HTTP {e.code}: {e.reason}"
    except (URLError, OSError) as e:
        return None, f"Connection error: {e}"
    except Exception as e:
        return None, f"Error: {e}"

def cmd_status(args):
    """Show campaign status from dashboard API."""
    config = load_config()
    api_url = config["api_url"]
    campaign_id = config["campaign_id"]

    resp, err = api_request(f"{api_url}/campaigns/{campaign_id}")
    if err:
        print(f"API unavailable (offline): {err}")
        print(f"\nLocal config:")
        print(f"  Campaign ID: {config['campaign_id']}")
        print(f"  Title:       {config.get('title', 'N/A')}")
        print(f"  State:       {config.get('state_code', 'N/A')}")
        print(f"  Dashboard:   {config.get('dashboard_url', 'N/A')}")
        return

    c = resp["data"]
    print(f"Campaign: {c.get('title', 'N/A')}")
    print(f"  State:        {c.get('state_code', 'N/A')}")
    print(f"  Phase:        {c.get('phase', 'N/A')}")
    print(f"  Lane:         {c.get('lane', 'N/A')}")
    print(f"  GitHub:       {c.get('github_repo_url', 'N/A')}")
    print(f"  Solicitations: {c.get('solicitation_count', 0)}")
    print(f"  Updated:      {c.get('updated_at', 'N/A')}")

def cmd_advance(args):
    """Advance campaign to next lane."""
    config = load_config()
    api_url = config["api_url"]
    campaign_id = config["campaign_id"]

    # Get current lane
    resp, err = api_request(f"{api_url}/campaigns/{campaign_id}")
    if err:
        print(f"Error: Cannot reach API: {err}", file=sys.stderr)
        sys.exit(1)

    current_lane = resp["data"]["lane"]

    if args.to:
        target = args.to
    else:
        idx = LANE_ORDER.index(current_lane) if current_lane in LANE_ORDER else -1
        if idx >= len(LANE_ORDER) - 1:
            print(f"Already at final lane: {current_lane}")
            return
        target = LANE_ORDER[idx + 1]

    if target not in LANE_ORDER:
        print(f"Invalid lane: {target}. Must be one of: {LANE_ORDER}", file=sys.stderr)
        sys.exit(1)

    # Guardrails (advisory)
    warnings = []
    if current_lane == "scoping" and target == "development":
        if not list(Path("docs/plans").glob("*")) if Path("docs/plans").exists() else True:
            warnings.append("No files in docs/plans/ - design docs expected before development")
    elif current_lane == "development" and target == "testing":
        if not (Path("src").exists() and any(Path("src").iterdir())) if Path("src").exists() else True:
            warnings.append("src/ is empty - code expected before testing")
    elif current_lane == "testing" and target == "ready":
        demo_prep = Path("docs/demo-prep")
        if not demo_prep.exists() or not any(demo_prep.glob("*.md")):
            warnings.append("No demo prep files in docs/demo-prep/ - run Step 7 before advancing to ready")

    if warnings and not args.force:
        for w in warnings:
            print(f"Warning: {w}")
        try:
            answer = input("Override? [y/N] ").strip().lower()
        except EOFError:
            answer = "n"
        if answer != "y":
            print("Cancelled.")
            return
        # Log override as decision
        _log_decision_local(config, {
            "category": "process",
            "summary": f"Overrode guardrail for {current_lane} -> {target}",
            "reasoning": "; ".join(warnings),
            "human_override": True,
        })

    resp, err = api_request(
        f"{api_url}/campaigns/{campaign_id}/lane",
        method="PATCH",
        data={"lane": target},
    )
    if err:
        print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)

    print(f"Advanced: {current_lane} -> {target}")


def _log_decision_local(config, decision_data):
    """Write a decision to the main contracts repo logs/decisions/{campaign_id}/ directory."""
    contracts_root = config.get("contracts_root")
    campaign_id = config.get("campaign_id", "unknown")

    if contracts_root:
        logs_dir = Path(contracts_root) / "logs" / "decisions" / str(campaign_id)
    else:
        logs_dir = Path("logs/decisions")
    logs_dir.mkdir(parents=True, exist_ok=True)

    decision_id = str(uuid.uuid4())
    now = datetime.utcnow()
    date_str = now.strftime("%Y-%m-%d")

    # Find next sequence number for today
    existing = list(logs_dir.glob(f"{date_str}-*"))
    seq = len(existing) + 1

    filename = f"{date_str}-{seq:03d}-{decision_data.get('category', 'process')}.json"

    record = {
        "id": decision_id,
        "campaign_id": config["campaign_id"],
        "category": decision_data.get("category", "process"),
        "summary": decision_data.get("summary", ""),
        "detail": decision_data.get("detail"),
        "subcategory": decision_data.get("subcategory"),
        "proposed": decision_data.get("proposed"),
        "changed": decision_data.get("changed"),
        "reasoning": decision_data.get("reasoning"),
        "actor": decision_data.get("actor", "human"),
        "human_override": decision_data.get("human_override", False),
        "confidence": decision_data.get("confidence", "medium"),
        "phase": decision_data.get("phase"),
        "step": decision_data.get("step"),
        "created_at": now.isoformat(),
        "synced": False,
    }

    filepath = logs_dir / filename
    filepath.write_text(json.dumps(record, indent=2), encoding="utf-8")

    return record, filepath

def cmd_log_decision(args):
    """Log a decision locally and sync to API."""
    config = load_config()

    decision_data = {
        "category": args.category,
        "summary": args.summary,
        "reasoning": args.reasoning,
        "proposed": args.proposed,
        "changed": args.changed,
        "detail": args.detail,
        "subcategory": args.subcategory,
        "confidence": args.confidence or "medium",
        "phase": args.phase,
        "step": args.step,
    }

    record, filepath = _log_decision_local(config, decision_data)

    # Best-effort sync to API
    api_url = config["api_url"]
    campaign_id = config["campaign_id"]
    resp, err = api_request(
        f"{api_url}/campaigns/{campaign_id}/decisions",
        method="POST",
        data=record,
    )

    if err:
        print(f"Saved locally: {filepath.name} (API sync failed: {err})")
    else:
        record["synced"] = True
        filepath.write_text(json.dumps(record, indent=2), encoding="utf-8")
        print(f"Saved and synced: {filepath.name}")

def _upload_file(presigned_url, file_path, content_type):
    """Upload a file to S3 via presigned PUT URL. Returns True on success."""
    try:
        data = Path(file_path).read_bytes()
        req = Request(presigned_url, data=data, method="PUT")
        req.add_header("Content-Type", content_type)
        with urlopen(req, timeout=60) as resp:
            return 200 <= resp.status < 300
    except Exception as e:
        print(f"  Upload failed for {file_path}: {e}", file=sys.stderr)
        return False

SECTION_FILES = {
    "01_executive_brief": "01-executive-brief.md",
    "02_technical_approach": "02-technical-approach.md",
    "03_compliance_matrix": "03-compliance-matrix.md",
    "04_demo_walkthrough": "04-demo-walkthrough.md",
    "05_deployment_cost": "05-deployment-cost-model.md",
    "06_company_profile": "06-company-profile.md",
}

def cmd_push_deliverables(args):
    """Push response package sections and files to the dashboard."""
    import socket
    config = load_config()
    api_url = config["api_url"]
    campaign_id = config["campaign_id"]

    rp_dir = Path("docs/response-package")
    if not rp_dir.exists():
        print("Error: docs/response-package/ not found.", file=sys.stderr)
        sys.exit(1)

    # Read markdown sections
    sections = {}
    for key, filename in SECTION_FILES.items():
        filepath = rp_dir / filename
        if filepath.exists():
            sections[key] = filepath.read_text(encoding="utf-8")
        else:
            print(f"  Warning: {filepath} not found, skipping")

    if not sections:
        print("Error: No response package sections found.", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(sections)} section(s)")

    # Check for PDF and DOCX
    pdf_path = Path("deliverables/response-package.pdf")
    docx_path = Path("deliverables/response-package.docx")
    has_pdf = pdf_path.exists()
    has_docx = docx_path.exists()

    pdf_s3_key = None
    docx_s3_key = None

    # Get presigned upload URLs (best-effort, skip if S3 not configured)
    if has_pdf or has_docx:
        urls_resp, urls_err = api_request(f"{api_url}/campaigns/{campaign_id}/deliverables/upload-urls")
        if urls_err:
            print(f"  S3 upload URLs unavailable ({urls_err}), pushing sections only")
        else:
            url_data = urls_resp.get("data", {})

            if has_pdf:
                pdf_info = url_data.get("pdf", {})
                print(f"  Uploading PDF ({pdf_path.stat().st_size} bytes)...")
                if _upload_file(pdf_info.get("upload_url", ""), str(pdf_path), "application/pdf"):
                    pdf_s3_key = pdf_info.get("s3_key")
                    print("  PDF uploaded")

            if has_docx:
                docx_info = url_data.get("docx", {})
                print(f"  Uploading DOCX ({docx_path.stat().st_size} bytes)...")
                ct = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                if _upload_file(docx_info.get("upload_url", ""), str(docx_path), ct):
                    docx_s3_key = docx_info.get("s3_key")
                    print("  DOCX uploaded")

    # Push to dashboard API
    payload = {
        "sections": sections,
        "pdf_s3_key": pdf_s3_key,
        "docx_s3_key": docx_s3_key,
        "has_pdf": has_pdf,
        "has_docx": has_docx,
        "push_source": getattr(args, "source", "manual_push") or "manual_push",
        "pushed_by": socket.gethostname(),
        "notes": getattr(args, "notes", None),
    }

    resp, err = api_request(
        f"{api_url}/campaigns/{campaign_id}/deliverables",
        method="POST",
        data=payload,
    )

    if err:
        print(f"Error pushing deliverables: {err}", file=sys.stderr)
        sys.exit(1)

    result = resp.get("data", {})
    print(f"Pushed v{result.get('version', '?')} ({result.get('section_count', 0)} sections"
          f"{', PDF' if result.get('has_pdf') else ''}"
          f"{', DOCX' if result.get('has_docx') else ''})")

def cmd_sync(args):
    """Sync unsynced decisions to dashboard API."""
    config = load_config()
    api_url = config["api_url"]
    campaign_id = config["campaign_id"]
    contracts_root = config.get("contracts_root")

    if contracts_root:
        logs_dir = Path(contracts_root) / "logs" / "decisions" / str(campaign_id)
    else:
        logs_dir = Path("logs/decisions")
    if not logs_dir.exists():
        print(f"No decision logs found at {logs_dir}")
        return

    json_files = sorted(logs_dir.glob("*.json"))
    if not json_files:
        print("No decision files found.")
        return

    unsynced = []
    already_synced = 0

    for f in json_files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            if data.get("synced"):
                already_synced += 1
            else:
                unsynced.append((f, data))
        except (json.JSONDecodeError, KeyError):
            continue

    if not unsynced:
        print(f"All {already_synced} decisions already synced.")
        return

    synced_count = 0
    for filepath, data in unsynced:
        resp, err = api_request(
            f"{api_url}/campaigns/{campaign_id}/decisions",
            method="POST",
            data=data,
        )
        if not err:
            data["synced"] = True
            filepath.write_text(json.dumps(data, indent=2), encoding="utf-8")
            synced_count += 1

    print(f"Synced {synced_count} of {len(unsynced)} decisions ({already_synced} already synced)")

def main():
    parser = argparse.ArgumentParser(
        description="Campaign Bridge CLI - connect this repo to the dashboard",
        prog="campaign.py",
    )
    sub = parser.add_subparsers(dest="command", help="Available commands")

    # status
    sub.add_parser("status", help="Show campaign status")

    # advance
    adv = sub.add_parser("advance", help="Advance campaign to next lane")
    adv.add_argument("--to", help="Target lane (default: next in sequence)")
    adv.add_argument("--force", action="store_true", help="Skip guardrails")

    # log-decision
    log = sub.add_parser("log-decision", help="Log a development decision")
    log.add_argument("--category", required=True, help="Decision category")
    log.add_argument("--summary", required=True, help="One-line summary")
    log.add_argument("--reasoning", help="Why this decision was made")
    log.add_argument("--proposed", help="What was originally proposed")
    log.add_argument("--changed", help="What was changed")
    log.add_argument("--detail", help="Detailed description")
    log.add_argument("--subcategory", help="Subcategory")
    log.add_argument("--confidence", choices=["high", "medium", "low"], help="Confidence level")
    log.add_argument("--phase", help="Workflow phase")
    log.add_argument("--step", help="Step within phase")

    # sync
    sub.add_parser("sync", help="Sync unsynced decisions to dashboard API")

    # push-deliverables
    pd = sub.add_parser("push-deliverables", help="Push response package to dashboard")
    pd.add_argument("--source", default="manual_push", help="Push source (manual_push or auto_advance)")
    pd.add_argument("--notes", help="Optional notes for this version")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {
        "status": cmd_status,
        "advance": cmd_advance,
        "log-decision": cmd_log_decision,
        "sync": cmd_sync,
        "push-deliverables": cmd_push_deliverables,
    }
    commands[args.command](args)

if __name__ == "__main__":
    main()
