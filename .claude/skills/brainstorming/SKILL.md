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
- Read CLAUDE.md and relevant design docs in `docs/plans/`
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

## Demo Build Standards Checklist

When brainstorming a demo or deliverable, ensure the design includes these from the start (see CLAUDE.md "Demo Build Standards" for full details):

- [ ] **Container packaging** — Design must include `docker-compose.yml` and Dockerfile(s). Decide service boundaries early (one container or multiple).
- [ ] **`.env.example`** — Identify all config variables during design. Which need real values, which have defaults?
- [ ] **`GET /health` endpoint** — Include in backend API design. Returns `{"status": "ok"}`.
- [ ] **Error handling UX** — Design error states: what does the user see when the API is down, when Claude fails, when data is missing?
- [ ] **Seed data** — Plan what the first-run experience looks like. What sample data ships with the demo?
- [ ] **Domain routing** — Demo will be at `arthurshafer.com/{demo-name}`. Note any subpath routing considerations.

These are not optional. If the design doesn't address them, add them before generating implementation prompts.

## Decision Logging

During brainstorming, log significant decisions automatically using the campaign bridge CLI.

After each significant decision (architecture choice, scope decision, tech stack selection, UI approach, user override), run:

```bash
python scripts/campaign.py log-decision \
  --category {architecture|scope|ui-ux|implementation|process} \
  --summary "One-line description of the decision" \
  --reasoning "Why this was chosen" \
  --proposed "What agent originally suggested" \
  --changed "What user modified (if override)" \
  --confidence {high|medium|low}
```

If `scripts/campaign.py` is not available (not a campaign repo), fall back to inline logging:

```
DECISION: {category} - {summary}
PROPOSED: {what agent suggested}
CHANGED: {what user modified}
REASONING: {why}
```

These will be formalized into decision log entries after the session.
