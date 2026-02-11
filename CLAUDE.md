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
