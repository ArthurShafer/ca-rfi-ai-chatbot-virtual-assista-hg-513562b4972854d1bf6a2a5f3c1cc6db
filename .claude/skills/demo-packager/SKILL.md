---
name: demo-packager
description: Package a development demo into a professional, deliverable-ready repository for prime contractor handoff
trigger: /package
arguments:
  - name: project_dir
    description: Path to the demo project to package
    required: true
  - name: phase
    description: Run a specific phase only (1-7)
    required: false
---

# Demo Packaging Pipeline

Transform a development repository into a professional deliverable package for prime contractor handoff. The output includes clean code, branded documentation (PDF/DOCX), Terraform infrastructure-as-code, curated git history, and zero AI fingerprints.

## Relationship to the Delivery Prep Pipeline

The 8-stage Delivery Prep pipeline (defined in `docs/MasterPlan/integration-strategy.md`) is a superset of this packager. The Delivery Prep pipeline adds constraint profiling, security remediation, compliance mapping, SBOM generation, and other hardening steps that this packager does not cover.

**How the phases map:**

| Demo Packager Phase | Delivery Prep Stage | Notes |
|--------------------|--------------------|-------|
| Phase 1 (Project Analysis) | Stage 0 (Delivery Audit) | Stage 0 is a superset: adds constraint profiling and compliance pre-check |
| Phase 2 (Repo Cleanup) | Stage 7 (Final Assembly) | Cleanup moves to the end in the delivery pipeline |
| Phase 3 (Git History) | Stage 7 (Final Assembly) | Same |
| Phase 4 (Terraform) | Stage 5 (Architecture Docs) | Optional sub-step within deployment documentation |
| Phase 5 (Doc Generation) | Stages 4-5 (Documentation Phase) | Delivery pipeline produces more thorough, constraint-driven docs |
| Phase 6 (Quality/Rewrite) | Stage 7 (Final Assembly QA) | Same quality gate tooling |
| Phase 7 (Render/Finalize) | Stage 7 (Final Assembly) | Same |

**When to use this packager vs. the full Delivery Prep pipeline:**

- **This packager**: Quick packaging for demos that don't need the full hardening/compliance treatment. Good for demos where the prime doesn't need security posture docs, compliance mappings, or SBOMs.
- **Delivery Prep pipeline**: Post-agreement deliverables where the prime's security team, compliance team, and integrators all need documentation. The full 8-stage process with code freeze boundary.

The existing templates at `templates/docs/` and CLI tools (`preflight.py`, `quality_gate.py`) remain useful as building blocks within both workflows.

## Build-Time Standards

These conventions apply **during development**, not just at packaging time. Following them makes packaging near-automatic and avoids last-minute restructuring.

### Required: Container Packaging

Every demo MUST have a `docker-compose.yml` at its root that brings up the entire application with one command. This is non-negotiable — it's the universal handoff format.

```yaml
# docker-compose.yml — minimum viable
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
```

Multi-service demos split into named services:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    env_file: .env
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
```

**Test it**: `docker compose up` must work from a clean clone with only `.env` configured. If it doesn't, the demo isn't handoff-ready.

### Required: Environment Configuration

Every demo MUST have a `.env.example` with every config variable documented:

```bash
# .env.example
# Required
ANTHROPIC_API_KEY=           # Claude API key for AI features
DATABASE_URL=sqlite:///data/app.db  # Database connection (default works out of box)

# Optional
LOG_LEVEL=INFO               # DEBUG, INFO, WARNING, ERROR
PORT=3000                    # Application port
```

Rules:
- Defaults that work out of the box where possible (SQLite, in-memory, etc.)
- Comments explaining what each variable does
- Group into Required / Optional sections
- Never commit `.env` — only `.env.example`

### Required: README Shape

Every demo README follows this structure (see `templates/docs/README-template.md`):

1. **One-line description** — what this does
2. **Quick Start** — `docker compose up`, open URL
3. **What You're Looking At** — screenshot or description, what to try first
4. **Architecture** — simple diagram or bullets
5. **Configuration** — table of env vars
6. **Deploy to AWS** — steps or link to deployment guide

The recipient should understand what they're holding within 60 seconds of opening the README.

### NOT Standardized (Intentionally)

These choices are made per-demo based on what creates the best result:

- **Frontend framework** — React, Next.js, Gradio, static HTML, whatever fits
- **Backend framework** — FastAPI, Lambda, Next.js API routes, none
- **Database** — PostgreSQL, SQLite, DynamoDB, none
- **Auth** — Only if the demo needs it
- **Number of services** — One container or five, whatever the demo requires
- **UI design** — Each demo should look polished but doesn't need to share a design system

The outer shell (Docker, .env, README) is standardized. The app inside is whatever makes the best demo.

## Path Resolution

This skill runs from a **campaign repo**, but several tools and templates live in the **contracts monorepo**. Read `.campaign.json` at the campaign repo root and extract `contracts_root` (e.g., `C:\Users\artjs\Dev\statecontracts`). All monorepo paths below use `{contracts_root}` as prefix.

| Resource | Path |
|----------|------|
| Quality gate CLI | `{contracts_root}/scripts/package_demo.py` |
| Render script | `{contracts_root}/scripts/render_response.py` |
| Doc templates | `{contracts_root}/templates/docs/` (12 templates) |
| Deliverable CSS | `{contracts_root}/templates/deliverable.css` |
| Terraform modules | `{contracts_root}/terraform/modules/` |
| Writing style guide | `.claude/skills/demo-packager/writing-style-guide.md` (bundled in campaign repo) |
| Git history guide | `.claude/skills/demo-packager/git-history-guide.md` (bundled in campaign repo) |
| Terraform guide | `.claude/skills/demo-packager/terraform-guide.md` (bundled in campaign repo) |

If `.campaign.json` is missing, fall back to `C:\Users\artjs\Dev\statecontracts` as the contracts root.

## Prerequisites

Before running, verify:
- The demo project builds and runs successfully
- `{contracts_root}/scripts/package_demo.py` is available (quality gate CLI)
- Vale is installed (`vale --version`)
- Pandoc + WeasyPrint are installed
- Templates exist at `{contracts_root}/templates/docs/` and `{contracts_root}/templates/deliverable.css`
- Terraform modules exist at `{contracts_root}/terraform/modules/`

## Phase 1: Project Analysis

**Goal**: Understand the project deeply before generating anything.

### Pre-flight: Build-Time Standards Check

Before analysis, verify the project followed build-time standards (see CLAUDE.md "Demo Build Standards"):

| # | Check | Status | Fix if Missing |
|---|-------|--------|----------------|
| 1 | `docker-compose.yml` exists at project root | Required | **Stop and create it** — cannot package without this |
| 2 | `docker compose up` works from clean state | Required | Fix build issues before proceeding |
| 3 | `.env.example` exists with all variables documented | Required | Extract from code and create it |
| 4 | `GET /health` endpoint exists and returns `{"status": "ok"}` | Required | Add to backend before packaging |
| 5 | Error states show user-friendly messages (no stack traces) | Required | Add error boundaries / toast notifications |
| 6 | App boots with seed data (not empty) | Required | Add seed data fixtures or "Load Sample Data" button |
| 7 | Terraform uses `default_tags` with `Project` tag | Required | Add to provider block |
| 8 | README exists with Quick Start section | Recommended | Will be generated in Phase 5 if missing |
| 9 | Landing page / intro screen exists as the entry point | Required | Add before the main app view (see CLAUDE.md standard #9) |

If items 1-7 are missing, **fix them before proceeding to Phase 2**. These are foundational — retrofitting them during packaging is expensive and error-prone.

### Analysis

Read and analyze:
1. All source code files (backend and frontend)
2. `Dockerfile`, `docker-compose.yml`, and any deployment scripts
3. `requirements.txt`, `package.json`, or equivalent dependency files
4. Environment variable usage (`.env.example`, config files)
5. Database schema (migrations, models, or DDL files)
6. API endpoints (route definitions)
7. README and any existing documentation

Produce an internal working profile (not a deliverable) capturing:
- **Languages and frameworks**: e.g., "Python 3.11 + FastAPI backend, React 18 + Vite frontend"
- **AWS services used**: e.g., "App Runner, S3, ECR, CloudWatch"
- **Database**: e.g., "SQLite with 5 tables, schema in models.py"
- **Authentication**: e.g., "Simple password gate, session-based"
- **Key features**: List the 3-5 main capabilities
- **API surface**: List all endpoints with methods
- **External integrations**: Any third-party APIs
- **Security measures**: What's implemented (input validation, CORS, etc.)
- **Test coverage**: What tests exist

Save this profile to `packaging/project-profile.md` for reference in later phases.

## Phase 2: Repository Cleanup

**Goal**: Remove all development artifacts and AI traces.

1. **Clone the repo** to `packaging/workspace/` -- NEVER modify the original
   ```bash
   cp -r <project_dir> packaging/workspace/
   ```

2. **Run pre-flight with --fix**:
   ```bash
   python {contracts_root}/scripts/package_demo.py preflight packaging/workspace/ --fix --verbose
   ```

3. **Manual cleanup** (items the CLI might miss):
   - Remove any remaining `.claude/` directories
   - Remove `CLAUDE.md`, `TODO.md`, `WORK-COMPLETED.md`
   - Remove `docs/implementation-prompts/`, `docs/plans/`, `docs/implementation/`
   - Remove `logs/decisions/`, `ClaudeCrossTalk/`, `brainstorming/`
   - Remove `*.ps1` deployment scripts
   - Remove `skills/` directory (copied for Docker builds)
   - Remove `source.tar.gz` and build artifacts
   - Remove `.campaign.json`, `.build-ready`
   - Remove references to `arthurshafer.com` hosting from any docs (partner gets deployment-guide.md for AWS, not VPS details)

4. **Clean source code**:
   - Remove comments containing "Claude", "AI", "Generated by"
   - Remove debug `console.log()` and `print()` statements (unless they're operational logging)
   - Remove development-only API routes (e.g., `/debug/`, `/test/`)
   - Ensure consistent code formatting

5. **Verify cleanup**: Run pre-flight again to confirm zero artifacts remain.

## Phase 3: Git History Curation

**Goal**: Create a realistic-looking development history.

Load the detailed guide from `.claude/skills/demo-packager/git-history-guide.md` before executing this phase.

1. **Analyze** the existing commit log to understand what was built and in what order.

2. **Design 5-10 logical commits** that tell a professional development story. Example sequence:
   - "Initialize project structure and configuration"
   - "Add database schema and data access layer"
   - "Implement backend API with FastAPI endpoints"
   - "Build frontend interface with React and Tailwind"
   - "Add authentication and access controls"
   - "Configure Docker containerization and deployment"
   - "Add monitoring, logging, and error handling"
   - "Add documentation and testing"

3. **Rewrite history** in the `packaging/workspace/` clone:
   ```bash
   cd packaging/workspace/
   rm -rf .git
   git init
   ```

4. **Stage files in logical groups** and commit with backdated timestamps:
   ```bash
   GIT_AUTHOR_DATE="2026-01-20T09:30:00-05:00" GIT_COMMITTER_DATE="2026-01-20T09:30:00-05:00" \
     git -c user.name="Arthur Shafer" -c user.email="arthur@easycompanycloudworks.com" \
     commit -m "Initialize project structure and configuration"
   ```

5. **Spread timestamps** across 2-3 weeks during business hours (8 AM - 7 PM Eastern).

6. **Author identity**: Use "Arthur Shafer <arthur@easycompanycloudworks.com>" as primary. Optionally mix in "Dev Team <dev@easycompanycloudworks.com>" for team appearance.

7. **Verify** no commit messages reference Claude, AI, prompts, or "Co-Authored-By".

## Phase 4: Terraform Generation

**Goal**: Generate deployment-ready Terraform for the specific project.

Load the detailed guide from `.claude/skills/demo-packager/terraform-guide.md` before executing this phase.

1. **Determine required modules** based on the project profile:
   - Always include: `networking`, `iam-base`, `monitoring`, `ecr`
   - Include `dns-ssl` if the project uses a custom domain
   - Include `s3-backend` for state management

2. **Copy template modules** from the contracts monorepo:
   ```bash
   cp -r {contracts_root}/terraform/modules/ packaging/workspace/terraform/modules/
   ```

3. **Write application-specific Terraform** in `packaging/workspace/terraform/`:
   - `main.tf` -- Compose modules + add app-specific resources (App Runner, RDS, Lambda, API Gateway, etc. based on what the project actually uses)
   - `variables.tf` -- Project-specific variables
   - `outputs.tf` -- Key outputs (URL, ARN, etc.)
   - `backend.tf` -- S3 backend configuration
   - `terraform.tfvars.example` -- Realistic example values

4. **Generate cloud mapping table** (`terraform/CLOUD-MAPPING.md`) covering only the AWS services this project uses. Include Azure and GCP equivalents for each service.

5. **Validate**:
   ```bash
   cd packaging/workspace/terraform
   terraform init -backend=false
   terraform validate
   ```

## Phase 5: Documentation Generation

**Goal**: Fill all documentation templates with project-specific content.

Load the writing style guide from `.claude/skills/demo-packager/writing-style-guide.md` and follow it for ALL generated text.

1. **Load templates** from `{contracts_root}/templates/docs/` (12 templates)

2. **Generate each document** using the project profile from Phase 1:

   **Tier 1 -- Auto-generated** (fill completely):
   - `architecture.md` -- Real components, real data flow, real security boundaries. Include Mermaid diagrams for system architecture and data flow. Be specific: name actual services, ports, protocols.
   - `cost-model.md` -- Run `infracost breakdown --path=terraform/ --format=json` if available, otherwise estimate. Include LOE by role (Solution Architect, Full-Stack Developer, DevOps Engineer, QA). Three scenarios with real numbers.
   - `sustainment-plan.md` -- This project's actual stack, dependency update cadence, backup procedures, incident response for this specific architecture.
   - `deployment-guide.md` -- Step-by-step: clone, configure environment, terraform apply, verify. Specific to this project's actual deployment process.
   - `README.md` -- Quick-start, architecture overview, local development instructions. Specific to this project.

   **Tier 2 -- Light review needed** (fill with best assessment):
   - `executive-summary.md` -- 1 page, government-friendly, outcome-focused. No technology jargon unless necessary.
   - `risk-register.md` -- Real risks for this architecture (cloud dependency, key personnel, data security, scaling limits). Honest assessment.
   - `security-posture.md` -- What's actually implemented vs. what's recommended. Map to relevant NIST 800-53 controls. Be honest about gaps.
   - `accessibility.md` -- Honest Section 508 assessment. If the demo has limited accessibility, say so with a remediation plan.

   **Tier 3 -- Templates with placeholders** (fill what's knowable):
   - `past-performance.md` -- Leave for human input, but structure the sections
   - `staffing-plan.md` -- Generic team structure, leave names blank
   - `sla-template.md` -- Standard SLA terms, adjust metrics to this project's capabilities

3. **Generate architecture diagrams**:
   - Write a Python script to `docs/diagrams/architecture.py` using the `diagrams` library
   - Run it to produce PNG/SVG
   - Include Mermaid diagrams inline in architecture.md

4. **Place all docs** in `packaging/workspace/docs/deliverables/`

5. **Apply writing style rules throughout**:
   - Varied sentence length (8-25 words)
   - No consecutive paragraphs starting the same way
   - "We" and "the system" instead of passive voice
   - Specific language, not generic filler
   - Include honest limitations
   - No introductory filler -- start with substance

## Phase 6: Quality and Rewrite

**Goal**: Eliminate all AI fingerprints from generated documentation.

1. **Run quality gate**:
   ```bash
   python {contracts_root}/scripts/package_demo.py quality-gate packaging/workspace/ --verbose
   ```

2. **Review flagged items** from Vale output:
   - Each flagged vocabulary word: replace with the suggested alternative
   - Each flagged transition: rewrite the sentence opening
   - Em dash overuse: replace with commas or parentheses
   - Structural patterns: rewrite the opening
   - Hedging phrases: make direct statements
   - "Ensure" overuse: use "verify", "confirm", "check"

3. **Rewrite strategy**:
   - Do not just substitute words -- restructure sentences
   - Vary sentence length and structure
   - Add specific details instead of generic claims
   - Include occasional informal language ("This is not perfect yet, but...")
   - Add honest caveats and limitations

4. **Run quality gate again** after rewriting

5. **If >3 items still flag**, list them in `packaging/PACKAGING-REVIEW.md` for human review

6. **Optional**: Run GPTZero if API key is available:
   ```bash
   python {contracts_root}/scripts/package_demo.py quality-gate packaging/workspace/ --gptzero-api-key $GPTZERO_API_KEY
   ```

## Phase 7: Render and Finalize

**Goal**: Produce final deliverable package.

1. **Render documents**:
   ```bash
   python {contracts_root}/scripts/package_demo.py render packaging/workspace/ --verbose
   ```
   This produces PDF and DOCX in `deliverables/pdf/` and `deliverables/docx/`.

2. **Run final validation**:
   ```bash
   python {contracts_root}/scripts/package_demo.py validate packaging/workspace/ --verbose
   ```

3. **Produce packaging report** (`packaging/PACKAGING-REPORT.md`):
   - Files included in deliverable
   - Quality gate results (all pass / N items for review)
   - Terraform validation status
   - GPTZero scores per document (if run)
   - Estimated infrastructure costs
   - Items requiring human review (if any)

4. **Final checklist**:
   - [ ] All source code compiles/builds
   - [ ] All documentation renders to PDF without errors
   - [ ] Zero Vale errors in documentation
   - [ ] Zero secrets detected by Gitleaks
   - [ ] Git history looks professional (5-10 logical commits)
   - [ ] Terraform validates
   - [ ] No development artifacts remain
   - [ ] README provides clear setup instructions

5. **Output**: The `packaging/workspace/` directory IS the deliverable. It can be pushed to a clean GitHub repo or zipped for delivery.

## Running Individual Phases

If the `phase` argument is provided, run only that phase. This is useful for:
- Re-running documentation after code changes (Phase 5)
- Re-running quality gate after manual edits (Phase 6)
- Re-rendering after fixing flagged items (Phase 7)

When running a single phase, verify that prior phases have completed by checking for expected artifacts:
- Phase 2+ requires `packaging/project-profile.md` (from Phase 1)
- Phase 3+ requires `packaging/workspace/` (from Phase 2)
- Phase 5+ requires `packaging/workspace/terraform/` (from Phase 4)
- Phase 6 requires `packaging/workspace/docs/deliverables/` (from Phase 5)
- Phase 7 requires Phase 6 quality gate to have passed

## Error Recovery

If a phase fails:
1. Read the error output carefully
2. Fix the root cause (missing dependency, malformed file, etc.)
3. Re-run that specific phase with `phase` argument
4. Do NOT skip phases -- each builds on the prior

Common issues:
- **Vale not installed**: `brew install vale` or `choco install vale`
- **WeasyPrint fails**: Check system dependencies (`pango`, `cairo`)
- **Terraform validate fails**: Check module source paths are relative to workspace
- **Gitleaks finds secrets**: Remove `.env` files, check for hardcoded keys
