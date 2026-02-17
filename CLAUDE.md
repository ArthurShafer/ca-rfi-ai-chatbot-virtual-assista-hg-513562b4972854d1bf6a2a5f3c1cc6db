# RFI   AI Chatbot & Virtual Assistant Solutions for Tulare County

## Solicitation Overview

| Field | Value |
|-------|-------|
| **State** | CA (CA) |
| **Type** | RFI (Request for Information) |
| **Number** | HG-513562b4972854d1bf6a2a5f3c1cc6db |
| **Agency** | County of Tulare |
| **Deadline** | February 12, 2026 (2 days remaining) |
| **Estimated Value** | $2,000,000 |
| **Portal** | [CA Portal](https://www.highergov.com/sl/contract-opportunity/ca-rfi-ai-chatbot-virtual-assistant-sol-61632885) |

## Contact
- **Name**: S. Portugal
- **Email**: sportugal@tularecounty.ca.gov
- **Phone**: None

## Tech Relevance
- **Score**: 75/100 - PURSUE
- **Signals**: NAICS: 541519, Tier1: artificial intelligence, Tier1: ai, Tier3: solution

## Description
26-040 - RFI – AI Chatbot & Virtual Assistant Solutions for Tulare County. This is a notice from Tulare County, California. The County of Tulare is releasing a Request for Information (RFI) to collect information on existing Artificial Intelligence (AI) Chatbot and Virtual Assistant technologies that could improve customer service and support for the public. Please refer to additional details for more information.

---

## Business Context & Demo Intent

**Who we are**: Easy Company Cloudworks LLC (Arthur Shafer), an independent technologist specializing in AI/ML, AWS cloud architecture, and web development. We do not have government contracting credentials, agency relationships, or corporate infrastructure (insurance, bonds, etc.).

**Our role**: Technical subcontractor to a prime contractor. We build the solution; the prime handles bidding, compliance, agency relationships, and contract administration.

**What this demo is for**: A working prototype that proves technical feasibility to potential prime contractors. Most bidders submit slide decks. We show up with a deployable application that already solves the problem. This flips the conversation: instead of "can you build this?" it becomes "this already works, let's submit together."

**Target audiences** (in priority order):
1. **Prime contractor technical evaluators** (CTO, VP Engineering) who need to validate the approach is sound
2. **Prime contractor business development** (CEO, VP BD) who need to see that teaming reduces their risk and accelerates their bid
3. **Government agency evaluators** who will see the demo as part of the proposal's technical volume

**What we bring**: Working demo, architecture docs, API specs, deployment playbooks, cost models, compliance matrix, and a technical response package ready for the prime to wrap in their corporate submission.

**What the prime brings**: Government contracting credentials, certifications (8(a), SDVOSB, HUBZone, WOSB), agency relationships, past performance references, insurance/bonding, and corporate bid infrastructure.

**Demo positioning**: Build for the actual solicitation requirements. Seed data should tell a coherent story relevant to the issuing agency. The demo should feel like a real product, not a proof-of-concept. It needs to run with `docker compose up` and be immediately impressive.

**Design decisions should optimize for**: (1) Directly addressing solicitation requirements, (2) Visual impact in a 15-minute demo walkthrough, (3) Technical credibility with engineering evaluators, (4) Deployability and maintainability. Do not over-engineer or add features beyond what the solicitation asks for.

---

## Workflow

Run `python scripts/campaign.py status` to see current campaign state.

### Phase: Scoping
1. Research environment: `/environment-constraints`
2. Brainstorm features (repeat per feature): `/brainstorming`
   - Output: `docs/plans/{feature}-design.md`
3. Align and generate build plan: `/align {project} --reorganize`
   - Resolves cross-feature conflicts interactively
   - Output: `docs/architecture/*`, `docs/implementation/*`
4. Log key decisions: `python scripts/campaign.py log-decision --category architecture --summary "..." --reasoning "..."`
5. Advance when build plan approved: `python scripts/campaign.py advance`

### Phase: Development (fresh Claude Code session)
1. Read `docs/implementation/README.md` -- the build guide
2. Execute prompts in order (01 -> 02 -> ... -> 07)
3. Reference `docs/architecture/*` for system context
4. Log decisions as they arise
5. Archive completed prompts: `mv docs/implementation/0*.md docs/implementation/archive/`
6. Advance when complete: `python scripts/campaign.py advance`

### Phase: Testing
1. Run `docker compose up --build -d` and wait for all containers to report healthy
2. Automated smoke tests: use curl to hit every endpoint in `docs/architecture/api-spec.md`
   through both the backend directly AND the frontend proxy (if applicable). For each
   endpoint, verify the expected HTTP status code and that the response is not an error.
   Log a pass/fail table to stdout. If any test fails, diagnose and fix before proceeding.
3. Common gotchas to check:
   - Frontend server-side proxy routes must use a runtime env var (not NEXT_PUBLIC_* or other build-time-inlined vars) to reach backend containers. Build-time vars resolve to localhost inside the container, which breaks container-to-container calls.
   - All services should have healthchecks in docker-compose.yml
   - Test with auth headers where endpoints require authentication
4. Visual smoke test: use the `webapp-testing` skill to launch a headless Playwright browser against
   localhost. Navigate to each page/route, take a screenshot, and check the browser console for errors.
   If any page shows a blank screen, React hydration error, or JS exception, diagnose and fix before
   proceeding.
5. If all automated checks pass, report results and leave containers running for manual QA review (UI/UX walkthrough at localhost)
6. Advance: `python scripts/campaign.py advance`

### Phase: Documentation
1. Generate Technical Response Package: `/response-package`
2. Package for handoff: `/package`
3. Advance to ready: `python scripts/campaign.py advance`

---

## Architecture Reference

Before making changes to the codebase, read:
1. `docs/architecture/architecture.md` -- system design + component diagram
2. `docs/architecture/data-model.md` -- all tables + ER diagram
3. `docs/architecture/api-spec.md` -- all endpoints

These are your ground truth. If something contradicts an architecture doc, the architecture doc wins.

> **Note**: These files are generated during the Scoping phase by `/align --reorganize`. They will be empty until alignment runs.

---

## Docker Conventions
- If the frontend proxies API calls through server-side routes, those routes must read the backend URL from a runtime environment variable (not a build-time var). Set this var in docker-compose.yml pointing to the internal service name.
- All services in docker-compose.yml should have healthchecks.
- Dependent services should use `depends_on` with `condition: service_healthy`.

---

## Skills Available

| Skill | Purpose |
|-------|---------|
| environment-constraints | Research target org IT environment |
| brainstorming | Design approach, produce feature designs |
| prompt-alignment | Align features into build-order prompts + architecture docs |
| implementation-executor | Execute prompts with validation |
| response-package | Generate branded RFP/RFI response package |
| react-best-practices | React/Next.js frontend |
| fastapi-templates | FastAPI backend |
| ui-ux-pro-max | UI/UX design |
| webapp-testing | Playwright browser testing (screenshots, console errors, UI verification) |

---

## Source Materials

See `docs/solicitation/SOURCES.md` for:
- Original solicitation document links
- Downloaded attachments
- Amendments

---

## Writing Style (All Generated Text)

All prose output must avoid AI tells. This applies to code comments, docs, READMEs, commit messages, response packages, and any written content:
- **No em dashes** (the long dash). Use commas, periods, semicolons, or parentheses instead
- **No filler openers**: "Certainly", "Great question", "I'd be happy to", "Absolutely"
- **No hedge stacking**: "it's important to note that", "it's worth mentioning that"
- **No corporate fluff**: "leverage", "utilize", "facilitate", "streamline", "robust", "comprehensive", "cutting-edge"
- **No list-love**: don't default to bullet lists when a sentence works fine
- Write like a real engineer: direct, concise, occasional informality

---

## Decision Log

Decisions are logged to the main contracts repo (not this campaign repo). The `log_decision.py` script reads `contracts_root` from `.campaign.json` and writes to `{contracts_root}/logs/decisions/{campaign_id}/` automatically.

---

## Parent System

This campaign is managed by the Government Contracting Workflow System.
Dashboard: arthurshafer.com/contractdashboard

---

<!-- SYNC:PIPELINE -->

## Business Context & Demo Intent

**Who we are**: Easy Company Cloudworks LLC (Arthur Shafer), an independent technologist specializing in AI/ML, AWS cloud architecture, and web development. We do not have government contracting credentials, agency relationships, or corporate infrastructure (insurance, bonds, etc.).

**Our role**: Technical subcontractor to a prime contractor. We build the solution; the prime handles bidding, compliance, agency relationships, and contract administration.

**What this demo is for**: A working prototype that proves technical feasibility to potential prime contractors. Most bidders submit slide decks. We show up with a deployable application that already solves the problem. This flips the conversation: instead of "can you build this?" it becomes "this already works, let's submit together."

**Target audiences** (in priority order):
1. **Prime contractor technical evaluators** (CTO, VP Engineering) who need to validate the approach is sound
2. **Prime contractor business development** (CEO, VP BD) who need to see that teaming reduces their risk and accelerates their bid
3. **Government agency evaluators** who will see the demo as part of the proposal's technical volume

**What we bring**: Working demo, architecture docs, API specs, and a demo prep package that frames the walkthrough for prime contractor conversations. Post-agreement, we run a full delivery prep pipeline (container hardening, SBOM, compliance mapping, deployment docs).

**What the prime brings**: Government contracting credentials, certifications (8(a), SDVOSB, HUBZone, WOSB), agency relationships, past performance references, insurance/bonding, and corporate bid infrastructure.

**Demo positioning**: Build for the actual solicitation requirements. Seed data should tell a coherent story relevant to the issuing agency. The demo should feel like a real product, not a proof-of-concept. It needs to run with `docker compose up` and be immediately impressive.

**Design decisions should optimize for**: (1) Directly addressing solicitation requirements, (2) Visual impact in a 15-minute demo walkthrough, (3) Technical credibility with engineering evaluators, (4) Deployability and maintainability. Do not over-engineer or add features beyond what the solicitation asks for.

---

## Workflow: 7 Steps, 7 Sessions

Each step runs in its own Claude Code session. Between steps, Arthur runs `/clear` and tells the agent which step to run. The agent reads this CLAUDE.md for campaign context and HANDOFF.md (if it exists) for the previous step's output.

Run `python scripts/campaign.py status` to see current campaign state.

### How to Run

```
Step 1:  "Run Step 1"        (opens repo, begins)
          /clear
Step 2:  "Run Step 2"        (reads HANDOFF.md from Step 1)
          /clear
Step 3:  "Run Step 3"        (reads HANDOFF.md from Step 2)
          /clear
Step 4:  "Run Step 4"        (reads HANDOFF.md from Step 3)
          /clear
Step 5:  "Run Step 5"        (reads HANDOFF.md from Step 4)
          /clear
Step 6:  "Run Step 6"        (reads HANDOFF.md from Step 5)
          /clear
Step 7:  "Run Step 7"        (reads HANDOFF.md from Step 6)
```

If a step fails or needs a redo: `/clear`, then "Run Step N" again. The HANDOFF.md from the previous step is still there.

### Lane Advances

Lanes advance at these points only:
- After Step 2 completes: scoping -> development
- After Step 4 completes: development -> testing
- After Step 7 completes (and Arthur confirms): testing -> ready

### Decision Policy

Make reasonable default choices. Only stop to ask when:
- The solicitation is ambiguous about a core requirement (not a nice-to-have)
- Two valid approaches have materially different cost/timeline implications
- A compliance requirement could change the architecture fundamentally

Do NOT stop to ask about: tech stack (default Next.js + FastAPI + SQLite unless solicitation indicates otherwise), UI framework (default Tailwind), container strategy (always Docker Compose), or other standard choices documented in DESIGN-PHILOSOPHY.md.

### HANDOFF.md Format

At the end of each step, write `HANDOFF.md` in the repo root (overwriting any previous version). This is the bridge to the next session. Include only what the next step needs:

```
# Handoff: Step N -> Step N+1

## What I Did
(2-3 sentences: what was accomplished, what the key outputs are)

## Files Created/Modified
(list of files the next step should read or be aware of)

## Decisions Made
(architectural or design decisions that affect downstream steps, with brief rationale)

## Issues & Caveats
(anything that broke, workarounds applied, known rough edges)

## For the Next Step
(specific context the next session needs that isn't obvious from the files themselves)
```

Keep it tight. The next session can read the actual files; HANDOFF.md tells it *which* files matter and *why*.

---

### Pre-Flight: Document Validation

**Every session runs this automatically before its step.** Verify that the Statement of Work (SOW) or equivalent detailed requirements document exists. The SOW is the primary build target, not the solicitation posting.

1. Read `docs/solicitation/SOURCES.md` to understand the document hierarchy
2. List all files in `docs/solicitation/` and `docs/solicitation/attachments/`
3. **Find the primary requirements document**: SOW, Statement of Work, Scope of Work, Performance Work Statement, detailed RFP requirements section, technical specifications, or requirements matrix. Read it. Confirm it contains functional requirements, technical requirements, and deliverable expectations.
4. **If the SOW exists**: proceed to the current step.
5. **If only a solicitation posting exists** (no detailed requirements): **STOP.** Tell the user the repo has a posting but no SOW. Point them to the procurement portal URL from SOURCES.md. HigherGov doesn't always have all attachments.
6. **User override** (when no SOW exists): Some solicitations genuinely have no separate SOW (common with RFIs). If the user confirms "this is everything," proceed conservatively: 2-3 features max, ask more questions, flag "Built from posting only" in design docs.

---

### Step 1: Research

**Skill**: `/environment-constraints`

**Read first**:
- CLAUDE.md (this file, for campaign context)
- DESIGN-PHILOSOPHY.md
- `docs/solicitation/SOURCES.md`
- The primary requirements document (SOW). This is the build target. Read it thoroughly.
- Supplemental documents (solicitation posting, etc.) for context

**Do**:
1. Run Pre-Flight Document Validation (above)
2. Run `/environment-constraints` using the SOW's requirements
3. Log key decisions: `python scripts/log_decision.py --category research --summary "..." --reasoning "..."`

**Produces**:
- `docs/requirements/{project}-environment-constraints.md` (constraint table with confidence levels and demo implications)

**Write HANDOFF.md** with: constraint document path, confirmed compliance frameworks (CJIS, HIPAA, etc.), database/auth/hosting assumptions, organization branding details if found.

---

### Step 2: Design

**Skills**: `/brainstorming`, `/align --reorganize`

**Read first**:
- CLAUDE.md, HANDOFF.md
- DESIGN-PHILOSOPHY.md (reference for all design decisions; consult this at every decision point instead of asking Arthur)
- `docs/requirements/{project}-environment-constraints.md` (from Step 1)
- The primary requirements document (SOW)
- Supplemental solicitation docs

**Do**:
1. Run `/brainstorming` for each feature required by the SOW. Every feature traces to a specific SOW requirement.
   - Output: `docs/plans/{feature}-design.md` per feature
2. Run `/align {project} --reorganize` to resolve cross-feature conflicts and produce the build plan
   - Output: `docs/architecture/*`, `docs/implementation/*`
3. Log key decisions

**Produces**:
- `docs/plans/*.md` (feature designs with theatrical design sections)
- `docs/architecture/architecture.md` (system design, component diagram, tech stack)
- `docs/architecture/data-model.md` (tables, ER diagram, migrations)
- `docs/architecture/api-spec.md` (all endpoints, request/response)
- `docs/implementation/README.md` (build guide, execution sequence)
- `docs/implementation/01-*.md` through `07-*.md` (build prompts)
- `.build-ready` marker

**Lane advance** (scoping -> development): `python scripts/campaign.py advance`

**Write HANDOFF.md** with: summary of features designed, hero feature name, number of build prompts generated, any cross-feature conflicts resolved, architecture decisions that deviate from defaults.

---

### Step 3: Build

**Skill**: `implementation-executor` (follows build prompts from Step 2)

**Read first**:
- CLAUDE.md, HANDOFF.md
- `docs/implementation/README.md` (build guide with execution sequence)
- `docs/architecture/architecture.md`, `data-model.md`, `api-spec.md`
- DESIGN-PHILOSOPHY.md (for design decisions during coding)
- Feature designs from `docs/plans/*.md` (theatrical design sections)

**Do**:
1. Execute build prompts in order (01 through final numbered prompt)
2. Reference architecture docs as ground truth
3. Archive completed prompts: `mv docs/implementation/0*.md docs/implementation/archive/`
4. Log decisions as they arise

**Subpath deployment gotcha (Next.js)**: Every demo deploys to `arthurshafer.com/<demo-name>`, which requires `basePath` in `next.config.js`. Three different behaviors:
- `router.push()` and `<Link href>`: auto-prepends basePath. Use paths WITHOUT prefix
- `fetch()` calls: raw HTTP, no auto-prepend. Use full path WITH prefix
- `usePathname()`: returns path WITHOUT basePath. Comparisons must use unprefixed paths
Getting this wrong causes double-prefixed URLs that only break in production.

**Produces**:
- `src/backend/` (full backend codebase)
- `src/frontend/` (full frontend codebase)
- `docker-compose.yml`, `docker-compose.prod.yml`
- `.env.example`, `.env.production.example`
- Dockerfiles

**Write HANDOFF.md** with: what was built (tech stack, number of endpoints, number of pages), docker compose health status, any build issues or workarounds, deviations from architecture docs, missing or incomplete features.

---

### Step 4: Test

**Skill**: `webapp-testing` (Playwright browser testing)

**Read first**:
- CLAUDE.md, HANDOFF.md
- `docs/architecture/api-spec.md` (endpoint list to test)
- `docs/plans/*.md` (user workflows to smoke test)

**Do**:
1. `docker compose up --build -d`, wait for all containers healthy
2. API smoke tests: curl every endpoint in `api-spec.md` through both backend directly AND frontend proxy. Log pass/fail table.
   - curl tests verify the server responds, not that pages render. Do NOT treat curl 200 as evidence the frontend works.
3. **Visual smoke test (required)**: use `webapp-testing` to launch Playwright against localhost. Screenshot every page, check console for JS errors. Fix blank screens, hydration errors, 404s, JS exceptions.
4. Gotchas: frontend proxy must use runtime env vars for backend URLs; all services need healthchecks; test auth-protected endpoints with proper headers.
5. Fix all failures before proceeding. Leave containers running.

**Lane advance** (development -> testing): `python scripts/campaign.py advance`

**Produces**:
- Smoke test results (pass/fail tables for API and visual tests)
- All bugs fixed, application fully functional

**Write HANDOFF.md** with: test results summary (endpoints passing, pages verified), any issues found and how they were fixed, which features work perfectly vs. have rough edges, current docker health status.

---

### Step 5: Polish

**Skill**: `/polish`

**Read first**:
- CLAUDE.md, HANDOFF.md
- DESIGN-PHILOSOPHY.md (primary reference for all visual decisions)
- `docs/solicitation/SOURCES.md` + all `*-extracted.md`
- `docs/requirements/*-environment-constraints.md` (org branding, colors)
- `docs/plans/*.md` (theatrical design sections)

**Do**:
1. `docker compose up --build -d` (fresh start)
2. Run `/polish` with three passes:
   - **Pass 1 (Landing Page)**: Build/evaluate cover page. Single viewport (1440x900), methodology-first, technical terminology, org colors.
   - **Pass 2 (Visual Identity)**: Run ui-ux-pro-max for style selection. Screenshot all views. Apply org branding, fix generic styling.
   - **Pass 3 (AI Theatrics)**: Refine theatrical elements from `docs/plans/*.md` design sections. Do NOT invent new theatrics; enhance what was designed.
3. Individual passes if needed: `/polish --pass landing`, `/polish --pass visual`, `/polish --pass theatrics`

**Produces**:
- Landing page with all 9 elements
- Org color scheme and typography applied throughout
- AI theatrical elements enhanced
- All pages screenshotted and verified

**Write HANDOFF.md** with: what visual changes were made, org colors applied (hex values), landing page status, which theatrical elements were enhanced, any frontend issues found during polish.

---

### Step 6: Deploy

**Skill**: `/demo-deploy`

**Read first**:
- CLAUDE.md, HANDOFF.md
- `.campaign.json` (demo slug)

**Do**:
1. Verify `.env.production.example` exists (should have been created in Step 3). If missing, create it.
2. Run `/demo-deploy`
3. **Verify the live URL with a browser, not just curl.** Use `webapp-testing` (Playwright) against the production URL. Screenshot every page, check console for errors. curl returns HTTP 200 for SPA routes even when client-side routing is completely broken.
4. Fix any production-only issues (basePath routing, asset paths through Caddy, CORS, API routing) and redeploy if needed.

**Produces**:
- Live demo at `arthurshafer.com/{slug}`
- Caddy config updated, docker stack running on Droplet

**Write HANDOFF.md** with: live URL, deployment status (all pages verified?), any production-only issues found and fixed, API keys or config that need attention, features working vs. not working on production.

---

### Step 7: Demo Prep

**Read first**:
- CLAUDE.md, HANDOFF.md
- The actual codebase (re-read to verify what was built, do not assume from memory):
  - Backend config/settings file
  - Main AI orchestration service (the file that calls the LLM API)
  - `requirements.txt` / `package.json` for actual dependencies
- `docs/solicitation/SOURCES.md` + SOW
- `docs/plans/*.md` (hero feature, wow moments, theatrical design)
- `docs/architecture/architecture.md`
- `.campaign.json` (campaign context)
- `docs/requirements/*-environment-constraints.md`

**Do**:
Generate these 5 files for partner demo calls (the docs you pull up on your second monitor during a video call):

`docs/demo-prep/talking-points.md`:
- What the system does (2-3 sentences, no jargon)
- Why built this way (technology choices, architecture decisions)
- What the seed data represents and why it's relevant to the agency
- The wow moments and how to frame them
- What's real vs. simulated (be honest)

`docs/demo-prep/walkthrough-script.md`:
- Structure around the hero feature (build toward it, not page-by-page)
- Open with landing page (methodology framing), supporting features (context), hero feature (climax)
- For each stop: what to click, what buyer sees, what to say
- Time estimates per section (10-12 min total, 3-5 for questions)
- What to skip if running short (cut supporting features, never the hero)
- What NOT to show (known rough edges)

`docs/demo-prep/technical-qa.md`:
- Anticipated technical questions with prepared answers
- Auth, on-prem/GovCloud, compliance, database, scaling, security
- Agency-specific and solicitation-specific questions from the SOW

`docs/demo-prep/delivery-overview.md`:
- Frame the Phase 2 delivery pipeline: container hardening, SBOM, security docs, compliance mapping, API docs, architecture docs, cost model, sustainment plan, audience-routed README
- "Your engineers open this repo and everything is already done."

`docs/demo-prep/company-brief.md`:
- One-pager: Easy Company Cloudworks LLC, Arthur's background, technical capabilities, teaming model

After demo prep is complete, ask Arthur: "Is the product where you want it, or does it need more work?" Iterate on any feedback. When he confirms done:

**Lane advance** (testing -> ready): `python scripts/campaign.py advance --to ready`

Then run the pipeline retrospective:
```
/pipeline-retrospective
```
This will review the build, ask Arthur for subjective feedback, map it to agent decisions, and propose generalized pipeline improvements. It asks for approval before making changes.

**Campaign is done.** Ready for partner outreach and demo walkthrough calls.

---

## Architecture Reference

Before modifying code (Steps 3-6), read these as ground truth:
1. `docs/architecture/architecture.md` (system design + component diagram)
2. `docs/architecture/data-model.md` (all tables + ER diagram)
3. `docs/architecture/api-spec.md` (all endpoints)

If something contradicts an architecture doc, the architecture doc wins.

> **Note**: Architecture files are generated during Step 2 by `/align --reorganize`. They will be empty until Step 2 runs.

---

## Docker Conventions

- If the frontend proxies API calls through server-side routes, those routes must read the backend URL from a runtime environment variable (not a build-time var). Set this var in docker-compose.yml pointing to the internal service name.
- All services in docker-compose.yml should have healthchecks.
- Dependent services should use `depends_on` with `condition: service_healthy`.
- **Subpath routing**: This demo deploys to `arthurshafer.com/{{demo-path}}`, meaning the app is served from a URL subpath, not the domain root. Configure your framework accordingly: for Next.js set `basePath` in `next.config.js`, for Vite set `base` in `vite.config.ts`, for other frameworks configure the equivalent path prefix. All internal links and asset paths must respect this prefix. Test locally with the base path configured before deploying.

---

## Deployment

All campaign demos deploy to a shared DigitalOcean Droplet at `arthurshafer.com/{{demo-path}}`.

```
arthurshafer.com (DigitalOcean Droplet, nyc1, 161.35.7.20)
    |
    Caddy (auto-SSL via Let's Encrypt, path-based routing)
    |
    /demo-a  -->  localhost:3001  (docker compose stack)
    /demo-b  -->  localhost:3002  (docker compose stack)
```

- **Droplet IP**: 161.35.7.20
- **SSH**: `ssh deploy@161.35.7.20`

Use the `/demo-deploy` skill in Step 6 to handle port allocation, production compose, Caddy config, and verification.

---

## Skills Available

| Skill | Step | Purpose |
|-------|------|---------|
| environment-constraints | 1 | Research target org IT environment |
| brainstorming | 2 | Design features, identify hero feature, AI theatrics |
| prompt-alignment | 2 | Align features into build-order prompts + architecture docs |
| implementation-executor | 3 | Execute build prompts in layer order |
| webapp-testing | 4, 6 | Playwright browser testing (smoke tests + deploy verification) |
| demo-polish | 5 | Landing page, visual identity (via ui-ux-pro-max), AI theatrics |
| ui-ux-pro-max | 5 | Style selection for visual identity pass |
| demo-deploy | 6 | Deploy demo to shared DigitalOcean server |

**On demand**: react-best-practices, fastapi-templates, browsing

---

## Source Materials

See `docs/solicitation/SOURCES.md` for portal links and attachment index.

Extracted text from solicitation PDFs (if available) is in `docs/solicitation/*-extracted.md`. Read these before any step that needs to understand the solicitation requirements.

---

## Writing Style (All Generated Text)

All prose must avoid AI tells. Code comments, docs, READMEs, commit messages, response packages, everything:
- **No em dashes**. Use commas, periods, semicolons, or parentheses
- **No filler openers**: "Certainly", "Great question", "I'd be happy to", "Absolutely"
- **No hedge stacking**: "it's important to note that", "it's worth mentioning that"
- **No corporate fluff**: "leverage", "utilize", "facilitate", "streamline", "robust", "comprehensive", "cutting-edge"
- **No list-love**: don't default to bullet lists when a sentence works fine
- Write like a real engineer: direct, concise, occasional informality

---

## Decision Log

Decisions are logged to the main contracts repo (not this campaign repo). The `log_decision.py` script reads `contracts_root` from `.campaign.json` and writes to `{{contracts_root}}/logs/decisions/{{campaign_id}}/` automatically.

---

## Parent System

This campaign is managed by the Government Contracting Workflow System.
Dashboard: arthurshafer.com/contractdashboard

<!-- /SYNC:PIPELINE -->
