---
name: response-package
description: Generate a branded RFP/RFI response package from demo + intel
trigger: /response-package
arguments:
  - name: section
    description: Generate only a specific section (executive-brief, technical-approach, compliance-matrix, demo-walkthrough, deployment-cost, company-profile)
    required: false
  - name: render-only
    description: Skip generation, just render existing markdown to PDF
    required: false
  - name: prime-name
    description: Name of the prime contractor (for cover page)
    required: false
---

# Response Package Generator

Generate a branded, RFP-specific technical response package by combining RFP intel from the dashboard, demo codebase analysis, and a static company profile. Output: 6 markdown sections rendered to a single branded PDF/DOCX.

## Phase 1: Gather Context

### Step 1: Read Campaign Config

Read `.campaign.json` from the current repo root. Extract:
- `campaign_id`
- `api_url`
- `title`
- `state_code`
- `contracts_root` (path to contracts monorepo)

If `.campaign.json` does not exist, stop and tell the user: "This must be run from a campaign repo with `.campaign.json`. Run `/response-package` from the campaign project directory."

### Step 2: Fetch RFP Intel

Use Bash to call:
```
curl -s {api_url}/campaigns/{campaign_id}/intel
```

Parse the JSON response. The data nesting is:
- `response.data.status` — "complete", "pending", "analyzing", or "error"
- `response.data.data` — contains `brief`, `strategy`, `contacts`, and optionally `research`
- `response.data.summary` — executive summary (sibling of `data`, NOT nested inside it)

Store `response.data.data` as `intel_data` and `response.data.summary` as `intel_summary`.

**If status is NOT "complete"**: warn the user but continue in degraded mode (see Degraded Mode below).

**If status is "complete"**: check whether `intel_data.research` exists. If absent, note that web research hasn't completed — tech stack and agency context sections will be thin.

### Step 3: Fetch Campaign Metadata

Use Bash to call:
```
curl -s {api_url}/campaigns/{campaign_id}
```

Extract from `response.data`:
- `title`, `state_code`
- `solicitations[0].agency`, `solicitations[0].type`, `solicitations[0].deadline`, `solicitations[0].portal_url`, `solicitations[0].external_id` (solicitation number)

### Step 4: Scan Demo Codebase

Read these files from the current repo (use Read and Glob tools, not shell commands):
- `README.md` — project description
- `docker-compose.yml` — service architecture
- `package.json` or `requirements.txt` — dependencies and tech stack
- `src/` or `app/` — scan for route definitions, components, features
- `docs/architecture.md` or similar — existing architecture documentation
- `.env.example` — configuration and required services

Produce an internal "demo profile" summary:
- Tech stack (languages, frameworks, databases)
- Features list (key capabilities)
- Architecture (services, how they connect)
- API surface (endpoints with methods)
- External integrations (third-party APIs, AWS services)

### Step 5: Load Company Profile

Load `company-profile.json`. Search in order:
1. Current repo root
2. `{contracts_root}/company-profile.json` (using `contracts_root` from `.campaign.json`)
3. `C:\Dev\contracts\company-profile.json` (hardcoded fallback)

Parse the JSON. This provides: company name, owner bio, capabilities, NAICS codes, differentiators, past performance, business info.

## Phase 2: Generate Sections

If `--render-only` was passed, skip this phase entirely and go to Phase 3.

Create the output directory: `docs/response-package/`

For each section (or just the one specified by `--section`), follow this process:

1. Read the corresponding template from the contracts monorepo at `{contracts_root}/.claude/skills/response-package/templates/`
2. Use the template structure and `<!-- GENERATE: ... -->` comments as guidance
3. Generate the section content using the gathered data (intel, demo profile, company profile)
4. Write the completed markdown to `docs/response-package/{section-filename}.md`

### Section → Data Mapping

| Section | File | Intel Fields | Demo Fields | Company Profile |
|---------|------|-------------|-------------|-----------------|
| Executive Brief | `01-executive-brief.md` | brief.*, strategy.strategic_angle, contacts, intel_summary | README, key features | capabilities, differentiators |
| Technical Approach | `02-technical-approach.md` | brief.requirements, brief.tech_stack_signals, *research.tech_stack* | Full scan, API routes, architecture | capabilities |
| Compliance Matrix | `03-compliance-matrix.md` | brief.requirements, brief.evaluation_criteria, brief.compliance | Feature list | naics_codes |
| Demo Walkthrough | `04-demo-walkthrough.md` | strategy.demo_recommendations | Full scan, docker-compose, README | — |
| Deployment & Cost | `05-deployment-cost-model.md` | brief.timeline, *research.tech_stack* | docker-compose, Terraform, requirements | — |
| Company Profile | `06-company-profile.md` | brief.set_asides | — | Full profile |

*Italicized* fields come from `research` which may be absent. Always check before accessing.

### Writing Style Rules

Apply these to ALL generated content:
- Use specific language: "processes 500 documents per hour" not "highly scalable"
- Varied sentence length: 8-25 words per sentence
- No consecutive paragraphs starting the same way
- First person plural: "we" and "our solution"
- Include honest limitations and extension roadmap items
- **No em dashes**. Use commas, periods, semicolons, or parentheses instead
- **Never use**: "leverage", "utilize", "cutting-edge", "robust", "seamless", "holistic", "synergy", "paradigm", "best-in-class", "comprehensive", "facilitate", "streamline"
- **No AI filler**: "Certainly", "Absolutely", "it's important to note that", "it's worth mentioning that"
- Government audience: outcome-focused, mention compliance explicitly, reference evaluation criteria by name
- No filler paragraphs. Every sentence should contain information

### After All Sections

Create `docs/response-package/README.md` with a table of contents:

```markdown
# Technical Response Package

**Opportunity**: {title}
**Agency**: {agency}
**State**: {state_code}
**Generated**: {current date}

## Sections

1. [Executive Brief](01-executive-brief.md)
2. [Technical Approach](02-technical-approach.md)
3. [Compliance Matrix](03-compliance-matrix.md)
4. [Demo Walkthrough](04-demo-walkthrough.md)
5. [Deployment & Cost Model](05-deployment-cost-model.md)
6. [Company Profile](06-company-profile.md)

## Rendering

To produce a branded PDF/DOCX:
```
python {contracts_root}/scripts/render_response.py . --prime-name "Prime Name" --agency "Agency" --solicitation-number "SOL-123"
```
```

## Phase 3: Render

Tell the user the sections have been generated and show the file list.

If `--render-only` was passed OR the user asks to render:

```bash
python {contracts_root}/scripts/render_response.py . \
  --prime-name "{prime_name_or_placeholder}" \
  --agency "{agency}" \
  --solicitation-number "{solicitation_number}"
```

Where:
- `{prime_name_or_placeholder}` is the `--prime-name` argument if provided, or "[Prime Contractor Name]" if not.
- `{agency}` comes from `.campaign.json` `agency` field or the campaign API response.
- `{solicitation_number}` comes from `.campaign.json` `solicitation_number` field or the campaign API `solicitations[0].external_id`.

Output lands in `deliverables/response-package.pdf` and `deliverables/response-package.docx`.

If `render_response.py` is not available or fails, tell the user:
- Install prerequisites: `python {contracts_root}/scripts/setup_packaging.py`
- Then re-run the render command above

## Degraded Mode

### Level 1: No Intel (status = "pending", "analyzing", or "error")

Generate only 4 of 6 sections:
- Executive Brief: use `.campaign.json` title and campaign metadata only
- Technical Approach: generate from codebase scan, skip requirements mapping
- Compliance Matrix: **SKIP** — write placeholder noting intel is needed
- Demo Walkthrough: generate normally
- Deployment & Cost: generate normally
- Company Profile: generate normally

Log: "RFP intel not available — generating partial response package (4 of 6 sections complete, compliance matrix skipped). Run `/response-package` again after RFP analysis completes."

### Level 2: Intel exists but no research (status = "complete", `brief` and `strategy` present, but no `research` key)

All 6 sections generate, but:
- Technical Approach: skip `research.subject_website.tech_stack` references, use `brief.tech_stack_signals` instead
- Deployment & Cost: skip agency tech stack integration context

Log: "Web research not yet complete — tech stack and agency context sections will be thin. Run `/response-package` again after web research completes for richer output."
