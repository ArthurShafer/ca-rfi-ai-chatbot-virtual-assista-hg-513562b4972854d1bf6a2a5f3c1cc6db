---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and implementation prompts through natural collaborative dialogue.

Start by understanding the current project context, then ask questions one at a time to refine the idea. Once you understand what you're building, present the design in small sections (200-300 words), checking after each section whether it looks right so far.

## The Process

**Understanding the idea:**
- Check out the current project state first (files, docs, recent commits)
- Read CLAUDE.md, `DESIGN-PHILOSOPHY.md`, and relevant design docs in `docs/plans/`
- If `docs/solicitation/SOURCES.md` exists, read it to understand the document hierarchy. Then read the primary requirements document (the SOW or highest-priority `*-extracted.md` file). If `docs/solicitation/RFP-INTEL.md` exists, read it for structured requirements analysis, demo recommendations, and risk factors. Every feature proposed during brainstorming should trace to a specific requirement from these documents.
- If `docs/requirements/` contains an environment constraints file, read it and use it as input for all architecture decisions. Reference specific constraints when proposing approaches. Note where the demo intentionally diverges from production constraints (e.g., "Demo uses SQLite; production would use SQL Server per environment research").
- Ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria

**Check AI Capabilities (when task involves technology choices):**
- If the brainstorm involves building software, demos, or choosing AI tools/patterns:
  1. Read `.claude/skills/ai-capabilities/catalog/INDEX.md` for the full domain taxonomy
  2. Identify 2-5 domains relevant to the task
  3. Load those specific domain files from `catalog/domains/`
  4. Use the capabilities, tools, and costs as input to approach options
- Skip this step for non-technical brainstorms (e.g., outreach strategy, pricing)

**Exploring approaches:**
- Propose 2-3 different approaches with trade-offs
- When AI capabilities were loaded, include specific tools with costs and maturity in each approach
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why

### Hero Feature Identification

Before designing individual features, identify which single feature is the demo's centerpiece. This is an interactive decision, not an autonomous one.

1. List all features implied by the solicitation
2. For each, assess: does this feature expose AI intelligence in a way that creates a visible "wow moment"? Or is it supporting infrastructure (dashboards, CRUD, admin panels)?
3. Present the list to the user with your recommendation for which feature is the hero:
   - **Hero** (1 feature): The feature the demo revolves around. Gets 60% of design attention. The walkthrough script builds toward this moment. The landing page methodology statement describes this feature's approach.
   - **Supporting** (1-3 features): Necessary context that makes the hero credible (admin dashboard, case management, reporting). Built competently but not the focus of theatrical design.
   - **Background** (0-2 features): Nice-to-haves that round out the product. Built if time allows.
4. The hero feature determines which user perspective the demo adopts as primary. If the hero is an AI interview, the demo is experienced from the interviewee's/counselor's perspective, not the admin's.

**This classification carries forward**: it appears in MANIFEST.md, influences build prompt sizing, determines where AI theatrics are designed, and shapes the walkthrough script structure.

**Identifying the wow moment (AI features only):**
- This step applies ONLY to features powered by AI/ML: intelligent matching, scoring engines, classification, AI chat, reasoning chains, RAG retrieval, document analysis, recommendation systems, predictive models, embeddings, NLP pipelines. If the feature is standard application functionality (CRUD, navigation, forms, data display, filtering, auth), skip this step entirely. A button click handler does not need a wow moment.
- For qualifying AI features, identify the single moment that makes a buyer say "show me that again"
- Ask: "When someone sees this AI feature for the first time, what's the moment they lean forward?"
- The wow moment drives architecture decisions for that feature. If the impressive part is AI analysis, the UI needs to expose the reasoning, not hide it behind a spinner. If it's intelligent matching, show the factors and weights, not just the match score.
- Name the wow moment explicitly in the design doc. This tells the polish session (Pass 3: AI Theatrics) exactly where to focus.

### AI Theatrics (per feature, during design, not deferred to polish)

For every feature that involves AI processing, answer during the design phase (not later):

**"How will this feature's intelligence be made visible to the viewer?"**

This is an interactive question. Present options to the user with your recommendation. Examples:
- Split-screen with real-time analysis panel (interview systems, document processing)
- Behavioral tag chips on AI output (pattern recognition, classification)
- Strategy disclosure card showing AI's next move and reasoning (adaptive systems)
- Confidence scores and evidence chains (matching, scoring, recommendations)
- Pipeline visualization showing data flow through processing stages
- Domain/topic coverage tracker with visual progress

The answer gets written into the feature design document (`docs/plans/{feature}-design.md`) under a "## Theatrical Design" section. The polish pass (Session 3) refines these elements but does NOT invent them. If theatrics aren't specified during brainstorming, the polish pass has nothing to work with.

For the hero feature specifically: the theatrical design should be detailed (specific UI components, panel layout, what data surfaces where). For supporting features: a brief note on any orchestration sequences or loading states is sufficient.

**Presenting the design:**
- Once you believe you understand what you're building, present the design
- Break it into sections of 200-300 words
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## After the Design

**Documentation:**
- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
- Commit the design document to git

**Implementation Prompts:**
After design approval, create implementation prompts:

1. **Break into logical units** - Each prompt = one cohesive feature or component
2. **Order by dependencies** - What must exist before this can be built
3. **Specify skills** - Which skills should be loaded for each prompt
4. **Estimate scope** - Small (< 1 hour), Medium (1-3 hours), Large (3+ hours)
5. **Write to files** - Save to `docs/implementation-prompts/`

See `docs/implementation-prompts/SCHEMA.md` for format.

## Implementation Prompt Format

Each prompt file should contain:

```markdown
# Implementation Prompt: {Title}

## Metadata
- **Order**: {sequence number}
- **Dependencies**: {list of prior prompts that must complete first}
- **Skills**: {skills to load: brainstorming, react-best-practices, ui-ux-pro-max, browsing}
- **Scope**: {Small | Medium | Large}
- **Estimated Tokens**: {rough estimate for execution}

## Context
{What already exists, what this builds on}

## Objective
{Clear statement of what to build}

## Requirements
{Bulleted list of specific requirements}

## Acceptance Criteria
{How to know it's done - testable conditions}

## Technical Notes
{Any specific technical guidance}
```

## Passthrough Validation

Before execution, all implementation prompts go through validation:

1. **Dependency check** - All dependencies satisfied
2. **Order validation** - Logical sequence
3. **Skill coverage** - All needed skills available
4. **Cost estimate** - Token usage + AWS costs if applicable
5. **Alignment check** - Consistent with design docs and CLAUDE.md

User approves batch before execution begins.

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended when possible
- **YAGNI ruthlessly** - Remove unnecessary features from all designs
- **Explore alternatives** - Always propose 2-3 approaches before settling
- **Incremental validation** - Present design in sections, validate each
- **Be flexible** - Go back and clarify when something doesn't make sense
- **Log decisions** - Capture key decisions per `logs/decisions/SCHEMA.md`

### Decision Policy: Architecture vs Demo UX

**Make autonomously** (present design, ask if it looks right):
- Tech stack (Next.js, FastAPI, SQLite unless solicitation indicates otherwise)
- Database schema, API design, service layer architecture
- Docker configuration, deployment approach
- Code organization, file structure, dependency choices

**Ask the user with options and a recommendation**:
- Hero feature selection (which feature is the demo's centerpiece)
- Theatrical approach (how AI intelligence is made visible, what UI patterns to use)
- Visual style direction (dark vs light, dense vs spacious, which ui-ux-pro-max style category)
- Primary user perspective (which role/persona the demo walkthrough follows)
- Landing page framing (how to describe the methodology, which technical terms to emphasize)

When asking about demo UX decisions, present 2-3 concrete options with your recommendation first. Example: "For the analysis panel, I'd recommend a split-screen with behavioral tags and strategy disclosure (similar to an ops console). Alternative: a collapsible sidebar with score summaries. Which direction?"

## Demo Build Standards Checklist

When brainstorming a demo or deliverable, ensure the design includes these from the start (see CLAUDE.md "Demo Build Standards" for full details):

- [ ] **Container packaging** — Design must include `docker-compose.yml` and Dockerfile(s). Decide service boundaries early (one container or multiple).
- [ ] **`.env.example`** — Identify all config variables during design. Which need real values, which have defaults?
- [ ] **`GET /health` endpoint** — Include in backend API design. Returns `{"status": "ok"}`.
- [ ] **Error handling UX** — Design error states: what does the user see when the API is down, when Claude fails, when data is missing?
- [ ] **Seed data** — Plan what the first-run experience looks like. What sample data ships with the demo?
- [ ] **Domain routing** — Demo will be at `arthurshafer.com/{demo-name}`. Note any subpath routing considerations.
- [ ] **Landing page** — Design the intro screen content: product title, methodology statement (how the system works, technical terminology), CTA button. Must fit a single viewport at 1440x900. See Build Standard #9.
- [ ] **API key absence handling** — For any feature depending on external API keys (LLM, TTS, STT), design the graceful degradation: styled "API key required" message, no blank screens, rest of app remains functional. See Build Standard #10.

These are not optional. If the design doesn't address them, add them before generating implementation prompts.

## Decision Logging

Log decisions **immediately** after each one is made. Do not batch or defer. Do not ask permission to log. All decisions are written to the main contracts repo (not the campaign repo). The scripts handle this automatically via `contracts_root` in `.campaign.json`.

### When to Log

- Architecture choice (framework, database, hosting, component structure)
- Scope cut or addition (feature in/out, MVP boundary)
- UI/UX decision (layout, flow, interactions, visual approach)
- Tech selection (library, API, service, tool)
- User override (human changes agent recommendation)
- Trade-off resolution (choosing between competing concerns)

### How to Log

**Primary** (works everywhere, main repo and campaign repos):

```bash
python scripts/log_decision.py \
  --category {architecture|scope|ui-ux|implementation|process|go-no-go} \
  --summary "One-line description" \
  --reasoning "Why this was chosen" \
  --proposed "What agent originally suggested" \
  --changed "What user modified" \
  --alternatives "Option A,Option B,Option C" \
  --confidence {high|medium|low}
```

For decisions with long reasoning, use stdin mode to avoid shell quoting issues:

```bash
python scripts/log_decision.py --stdin <<'DECISION'
{
  "category": "architecture",
  "summary": "Chose Next.js over Vite+React",
  "proposed": "Vite+React SPA for simpler setup",
  "changed": "Next.js for SSR and API routes",
  "reasoning": "App Router provides cleaner data fetching. Built-in API routes simplify backend. Familiar from previous projects.",
  "alternatives": ["Vite + React", "Remix", "Plain React + Express"],
  "human_override": true,
  "confidence": "high",
  "tags": ["frontend", "framework"]
}
DECISION
```

**Fallback** (campaign repos with campaign.py): `python scripts/campaign.py log-decision --category ... --summary ...`

**Last resort** (no scripts available):
```
DECISION: {category} - {summary}
PROPOSED: {what agent suggested}
CHANGED: {what user modified}
REASONING: {why}
```

### Behavioral Rules

- Always include `--proposed` and `--alternatives` when applicable
- Set `--human-override` when the user changes your recommendation
- Set `--actor human` when the user makes a decision without agent input
- Use `--confidence low` when the decision feels uncertain or reversible
- One log call per decision, not one call for a batch of decisions
