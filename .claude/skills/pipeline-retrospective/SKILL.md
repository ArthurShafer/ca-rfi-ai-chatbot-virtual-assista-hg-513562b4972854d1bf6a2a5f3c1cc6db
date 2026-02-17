# Pipeline Retrospective

## Overview

Audits a completed campaign build to identify where the pipeline (skills, CLAUDE.md, reference files, templates) fell short. Uses two inputs: the structured build logs that agents wrote during the build (capturing their reasoning and decisions), and the session transcripts (capturing correction sequences). Maps Arthur's subjective feedback on the final product back to specific agent decisions, then produces generalized recommendations for improving the pipeline for all future campaigns.

This is a routine post-build step, not optional. Run it after every Phase 1 build until the generalized instructions are as good as they can be. When an issue can't be solved with better instructions, that's a finding too: it means the workflow needs a human decision point there.

This skill runs in the **contracts repo**, not the campaign repo. It's invoked after a campaign build is complete and the user is satisfied with the final product.

## Trigger

User runs `/pipeline-retrospective <campaign-directory-path>`

Example:
```
/pipeline-retrospective C:\Users\artjs\Dev\statecontracts\campaigns\ri-ai-data-assessor-rhode-island-test-rfi26006340
```

## Inputs

- **Campaign directory path** (required): Absolute path to the campaign repo on disk
- The skill reads `docs/build-logs/*.md` from the campaign repo (primary source of agent reasoning)
- The skill also locates session transcripts from `~/.claude/projects/` (secondary source for correction sequences)

## Workflow

### Phase 1: Locate Transcripts

1. Convert the campaign directory path to the Claude Code project key format (replace path separators with `-`, strip drive colon)
2. Find all `.jsonl` transcript files in `~/.claude/projects/<project-key>/`
3. Sort by modification time (chronological order)
4. Report how many sessions found and their sizes

### Phase 2: Ingest Build Logs

Read all files in `<campaign-directory>/docs/build-logs/`. These are structured reasoning logs written by each agent during the build. Expected files (some may be absent if the build used sequential mode):

- `backend.md` -- Backend agent: API decisions, data model choices, service architecture
- `frontend.md` -- Frontend agent: UX/UI decisions, layout choices, interaction patterns, demo experience reasoning
- `integration.md` -- Integration agent: what broke when wiring the halves together, visual smoke test results, UX assessment
- `polish.md` -- Polish agent: landing page story, visual identity reasoning, AI theatrics, overall demo feel
- `build.md` -- Sequential build (replaces the above if not parallel)

For each log, extract:
- **Decisions made**: What the agent chose and why (especially UX/UI reasoning)
- **Problems hit**: What broke and how they fixed it
- **Uncertain areas**: Things the agent flagged as judgment calls or low confidence
- **Integration friction**: Mismatches between agents, things that broke at the seams

Present a consolidated summary to the user before proceeding. Format it as a readable narrative, not a dump. Group by theme (visual/UX, architecture, integration, problems), not by agent.

If build logs are missing (older campaigns built before this feature), note this and rely on transcript extraction alone (Phase 3).

### Phase 3: Extract the Correction Signal

Run the extraction script to pull structured data from the transcripts:

```bash
python phase-1-opportunity-dashboard/scripts/extract_session_feedback.py "<campaign-directory-path>"
```

This produces a JSON report at `logs/pipeline-feedback/<campaign-slug>-extraction.json` containing:
- All user messages (with timestamps and session IDs)
- All assistant text responses (condensed, no tool call details)
- Identified "correction sequences" -- clusters of user messages after the initial build/deploy where the user is requesting fixes, changes, or expressing dissatisfaction

If the script fails or is not available, fall back to manually reading the JSONL files with the Read tool, focusing on lines where `type == "user"`.

**Note**: With parallel builds, there will be multiple transcript files (one per agent window). The script handles this, but be aware that correction sequences may appear in the integration or polish session transcripts, not the build agent transcripts.

### Phase 3.5: Collect Subjective Feedback

Before analyzing, ask Arthur for his subjective take on the final product. Prompt with specific questions, not open-ended:

- "Walk me through what you saw. What hit right? What felt off?"
- "When you landed on the main page, what was your first reaction?"
- "Was there a moment in the demo flow where you thought 'this isn't what I wanted'?"
- "How did the AI interaction feel? Impressive, generic, or broken?"
- "Anything that felt like it was built for a different audience than a prime contractor CTO?"

Record his responses as-is. These are the ground truth that the build logs and corrections get measured against.

### Phase 4: Analyze Corrections

For each correction the user made (from transcripts) AND each subjective critique (from Phase 3.5):

1. **What was the issue?** Describe what the user fixed or flagged.
2. **What did the agent's build log say?** Find the corresponding decision in the build logs. Did the agent explain their reasoning for the choice Arthur rejected? If so, quote it. If the agent flagged it as uncertain, note that too.
3. **What pipeline stage caused this?** Map to one of:
   - `brainstorming` -- feature was missing, wrong, or poorly scoped
   - `alignment` -- prompts were in wrong order, architecture docs incomplete, cross-feature conflicts missed
   - `execution` -- code generation quality issue (wrong framework patterns, missing error handling, bad UI, broken functionality)
   - `polish` -- visual quality, landing page, AI theatrics, seed data story
   - `packaging` -- Docker issues, env config, deployment problems
   - `template` -- CLAUDE.md instructions were unclear or wrong, causing the session to go off track
   - `skill` -- a specific skill produced weak output (name the skill)
   - `reference` -- a reference file (DESIGN-PHILOSOPHY.md, architecture docs) was missing guidance that would have prevented the issue
4. **Why was it missed?** Root cause analysis. Was the skill missing a checklist item? Was the CLAUDE.md unclear? Did the architecture doc omit something? Was there no reference file covering this pattern?
5. **Where is the evidence?** Cite the build log file and section, AND the session ID and approximate transcript position if available.

### Phase 5: Generalize

Group the corrections by pipeline stage. For each stage with issues, classify into one of two categories:

#### Category A: Fixable with Better Instructions

The agent made a bad choice because the instructions didn't guide it well enough. A generalized instruction change would reliably produce a better result for any future campaign.

1. **Pattern**: What general class of problem does this represent? (e.g., "brainstorming consistently misses accessibility requirements" or "execution produces components without loading states")
2. **Generalized recommendation**: A specific, actionable change to the pipeline that would prevent this class of problem in ALL future campaigns, not just this one. Examples:
   - "Add to brainstorming skill checklist: 'Does the design account for accessibility requirements mentioned in the solicitation?'"
   - "Add to CLAUDE.md Docker Conventions: 'All API routes must return proper error responses, not stack traces'"
   - "Add to DESIGN-PHILOSOPHY.md: 'Every interactive element needs a loading state. No blank screens while waiting for API responses.'"
   - "Update demo-polish skill Pass 2 to check for consistent spacing between sections"
3. **Affected file**: Which specific file in the contracts repo should be modified (skill path, CLAUDE.md template location in kickoff_templates.py, DESIGN-PHILOSOPHY.md, etc.)
4. **Priority**: high (caused significant rework), medium (noticeable quality gap), low (minor polish)

#### Category B: Needs a Human Decision Point

The agent's reasoning was defensible given the instructions, but Arthur wanted something different. No generalized instruction would reliably capture this preference because:
- The choice is subjective or aesthetic (e.g., "this color palette feels too corporate")
- The right answer depends on context that varies between campaigns (e.g., "the hero feature emphasis was wrong for this audience")
- The preference is real but hard to articulate as a rule

For these, the recommendation is NOT a better instruction. It is a **decision point**: a place in the workflow where the agent should pause, present options, and ask Arthur instead of choosing autonomously.

1. **Where in the workflow**: Which step and which agent should pause
2. **What to present**: What options or artifacts the agent should show (e.g., "show 2-3 color palette options with mockups before committing," "present the landing page layout wireframe before building")
3. **Why it can't be automated**: Brief explanation of why a generalized instruction won't reliably match intent here
4. **Implementation**: Specific change to make -- typically an addition to the agent instructions or skill that says "STOP and ask Arthur: [question]" at the right moment

### Phase 6: Write Report

Save the report to `logs/pipeline-feedback/<campaign-slug>-retrospective.md` with this structure:

```markdown
# Pipeline Retrospective: <Campaign Title>

**Campaign**: <title>
**Build logs found**: <list of build log files>
**Sessions audited**: <count>
**Total issues identified**: <count>
**Date**: <today>

## Arthur's Feedback Summary

<Condensed version of the subjective feedback from Phase 3.5>

## Issue Log

### 1. <Short description of what was fixed or flagged>

- **Source**: correction (transcript) | subjective feedback | build log uncertainty
- **Stage**: brainstorming | alignment | execution | polish | packaging | template | skill | reference
- **What happened**: <description of the problem>
- **Agent's reasoning**: <what the build log said about this decision, if available>
- **Root cause**: <why the pipeline missed this>
- **Evidence**: Build log: <file, section> | Transcript: Session <id>, message <n>
- **Category**: A (fixable with instructions) | B (needs human decision point)
- **Priority**: high | medium | low

For Category A:
- **Generalized recommendation**: <specific change to make>
- **Affected file**: <path>

For Category B:
- **Decision point**: <where in workflow to pause>
- **What to present**: <what to show Arthur>
- **Why not automatable**: <brief explanation>

### 2. ...

## Summary by Stage

| Stage | Issues | Cat A | Cat B | High | Med | Low |
|-------|--------|-------|-------|------|-----|-----|
| brainstorming | 2 | 1 | 1 | 1 | 1 | 0 |
| execution | 3 | 2 | 1 | 0 | 2 | 1 |
| ... | | | | | | |

## Recommended Instruction Changes (Category A, Priority Order)

1. **[HIGH]** <file>: <specific change>
2. **[HIGH]** <file>: <specific change>
3. **[MED]** <file>: <specific change>
...

## Recommended Decision Points (Category B)

1. **<workflow step>**: <what to ask Arthur and when>
2. ...
```

### Phase 7: Present and Confirm

Present the report to the user. Walk through the findings in two groups:

**Category A (instruction changes):** For each, ask: "Does this feel like a reliable generalization, or is it specific to this campaign?" Only apply changes that pass that test.

**Category B (decision points):** For each, ask: "Is this really something that needs a human call every time, or did I just not articulate the rule well enough?" Some Category B items may move to Category A after discussion, and vice versa.

Then ask how to proceed:
1. **Apply approved changes now** -- make the edits to skills/CLAUDE.md/reference files in this session
2. **Save report only** -- just keep the report for manual review
3. **Discuss further** -- talk through specific items before deciding

If applying changes, make each edit and explain what changed and why. For Category B decision points, add the pause/ask instruction to the relevant agent instructions or skill files.

## Important Rules

- **NEVER make campaign-specific recommendations.** Every improvement must apply to all future campaigns regardless of solicitation type, state, or technology stack.
- **Do not recommend adding campaign-specific data** (agency names, state requirements, etc.) to pipeline files.
- **Focus on process gaps, not content gaps.** The question is never "should the brainstorming skill know about RIDOC?" but rather "should the brainstorming skill have a step that checks for domain-specific regulatory requirements?"
- **Be specific in recommendations.** "Improve the brainstorming skill" is useless. "Add checklist item 14 to brainstorming skill Phase 3: 'Verify that every user-facing page has a loading state for async operations'" is useful.
- **Trace to root cause, not symptoms.** If the user fixed a missing loading spinner on 3 pages, the root cause isn't "3 pages missing spinners" -- it's "the execution prompts don't include loading state requirements" or "the demo-polish skill doesn't check for loading states."
- **When something can't be generalized, say so.** Not every issue has an instruction fix. If the right answer depends on subjective judgment that varies per campaign, the correct recommendation is a human decision point, not a more elaborate instruction. Recognizing this is a finding, not a failure.
- **Build logs are the primary source.** When build logs are available, prefer them over raw transcript mining. The logs capture curated reasoning; transcripts capture everything including noise. Use transcripts to find correction sequences that the build logs missed, not as the primary analysis input.
- **Always ask before applying.** Never edit a file without presenting the exact change and getting Arthur's approval first. Show the specific text you will add/change, the file path, and the line range. Wait for confirmation.

### Off-Limits Files (DO NOT EDIT)

The following files contain syntax-sensitive orchestration logic (PowerShell here-strings, escaped variables, precise quoting). Incorrect edits break the entire agent spawning chain. **Do not open these files for editing under any circumstances:**

- `kickoff_templates.py` -- contains all launch script templates as raw string constants with nested PowerShell here-string syntax. One wrong quote or backtick breaks every future campaign.
- `scripts/launch-build.ps1`
- `scripts/launch-integrate.ps1`
- `scripts/launch-polish.ps1`
- `scripts/launch-retrospective.ps1`
- `scripts/check-parallel-done.ps1`
- Any file matching `scripts/.agent-*`, `scripts/.integrate-*`, `scripts/.polish-*`

If a retrospective finding requires changes to orchestration scripts or kickoff_templates.py, **write the recommendation in the report only**. Do not attempt the edit. Flag it as: "MANUAL EDIT REQUIRED: This change affects orchestration files that must be edited by hand with careful attention to PowerShell syntax." Arthur will make these changes himself or in a dedicated session focused on that file.

### Safe to Edit (with approval)

These files are plain markdown or structured text. Edits are low-risk:
- Skill files (`*.claude/skills/*/SKILL.md`)
- `DESIGN-PHILOSOPHY.md`
- `CLAUDE.md` template content within `kickoff_templates.py` -- **EXCEPTION: only the CLAUDE_MD string constant, and only if Arthur explicitly approves. Show the diff first.**
- Reference docs in the contracts repo

## Dependencies

- Python 3 (for extraction script)
- Read access to `~/.claude/projects/` transcript files
- Write access to `logs/pipeline-feedback/`
