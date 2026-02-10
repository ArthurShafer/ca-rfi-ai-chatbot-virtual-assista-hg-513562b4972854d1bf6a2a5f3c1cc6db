---
name: implementation-executor
description: "Execute implementation prompts with passthrough validation and cost estimation. Use after brainstorming produces implementation prompts."
---

# Implementation Executor

## Overview

This skill handles the execution of implementation prompts produced by brainstorming sessions. It validates prompt batches, estimates costs, and manages the execute → test → debug → refine loop.

## When to Use

- After brainstorming has produced implementation prompts in `docs/implementation-prompts/{project}/`
- When ready to build features from approved designs
- For passthrough validation before execution

## Passthrough Validation Workflow

Before executing any prompts, run validation:

### Step 1: Load Manifest
```
Read docs/implementation-prompts/{project}/MANIFEST.md
```

### Step 2: Validate Each Prompt

For each prompt, check:

1. **File exists** - Prompt file is present and properly formatted
2. **Dependencies satisfied** - All dependency prompts are listed and come earlier
3. **Skills available** - All specified skills exist in `.claude/skills/`
4. **Metadata complete** - All required fields populated

### Step 3: Build Execution Plan

Present to user:

```
## Execution Plan: {Project Name}

### Prompts to Execute
| # | Name | Scope | Dependencies | Skills |
|---|------|-------|--------------|--------|
| 01 | ... | Small | None | ... |
| 02 | ... | Medium | 01 | ... |

### Cost Estimate

**Token Usage**
- Estimated input: ~XXX,XXX tokens
- Estimated output: ~XX,XXX tokens
- Estimated cost: $X.XX (at current Claude rates)

**AWS Infrastructure** (if applicable)
| Resource | Monthly Cost | Notes |
|----------|--------------|-------|
| ... | $X.XX | ... |
| **Total** | **$X.XX/month** | |

### Ready to Execute?
Awaiting your approval to proceed.
```

### Step 4: User Approval

Wait for explicit approval before executing.

## Execution Loop

For each prompt in order:

### 1. Load Context
- Read the prompt file
- Load specified skills
- Read files listed in "Context" section
- Read files in "Files to Create/Modify" that exist

### 2. Execute
- Implement according to requirements
- Create/modify listed files
- Follow technical notes

### 3. Test
- Run automated tests if applicable
- Check acceptance criteria
- Verify no console errors (for frontend)

### 4. Log Decision
If significant decisions were made during implementation:
```json
{
  "category": "implementation",
  "prompt": "{prompt number and name}",
  "decision": "{what was decided}",
  "reasoning": "{why}"
}
```

### 5. Archive Completed Prompt
After a prompt executes successfully, move it to an `archive/` subfolder:
```
mv docs/implementation-prompts/{project}/01-feature.md docs/implementation-prompts/{project}/archive/01-feature.md
```
Create the `archive/` folder if it doesn't exist. This keeps the project folder clean — only pending prompts remain at the top level. The MANIFEST.md stays in place (not archived).

### 6. Report Status
After each prompt:
```
## Prompt {#} Complete: {Name}

### What Was Built
- {summary of changes}

### Files Modified
- {list of files}

### Acceptance Criteria
- [x] Criterion 1
- [x] Criterion 2

### Issues Encountered
- {any problems and how they were resolved}

### Ready for Next Prompt?
```

## Handling Failures

If a prompt fails:

1. **Document the failure** - What went wrong
2. **Assess impact** - Does this block subsequent prompts?
3. **Propose fix** - How to resolve
4. **Wait for guidance** - User decides: fix now, skip, or abort

Do NOT proceed to dependent prompts if a dependency failed.

## Batch Execution

For prompts with same dependencies (can run in parallel):

```
Prompts 03 and 04 have the same dependencies (01, 02).
These can be executed in parallel if desired.

Execute in parallel? [Yes/No]
```

## Cost Estimation Reference

### Token Estimates by Scope
| Scope | Input Tokens | Output Tokens | ~Cost |
|-------|--------------|---------------|-------|
| Small | 30-50K | 5-10K | $0.15-0.25 |
| Medium | 50-100K | 10-25K | $0.30-0.60 |
| Large | 100-200K | 25-50K | $0.60-1.20 |

### Common AWS Costs
| Resource | Monthly Cost |
|----------|--------------|
| RDS db.t3.micro | $15 |
| RDS db.t3.small | $30 |
| S3 (per GB) | $0.023 |
| Lambda (1M requests) | $0.20 |
| API Gateway (1M requests) | $3.50 |
| CloudFront (per GB) | $0.085 |

## Integration with Decision Logging

Significant implementation decisions should be auto-logged via the campaign bridge CLI.

After each significant decision during prompt execution (architectural choices, scope adjustments, workarounds, user overrides), run:

```bash
python scripts/campaign.py log-decision \
  --category implementation \
  --summary "One-line description" \
  --reasoning "Why this approach" \
  --phase development \
  --step "Prompt {number}"
```

If `scripts/campaign.py` is not available, fall back to inline logging:

```
DECISION: implementation - {summary}
PROMPT: {prompt number}
CONTEXT: {what the prompt required}
CHOICE: {what was implemented}
REASONING: {why this approach}
```

## Post-Execution

After all prompts in a batch complete:

1. **Summary report** - What was built, files changed
2. **Test run** - Full application test if applicable
3. **Decision log** - Formalize any inline decisions
4. **Update manifest** - Mark prompts as complete
5. **Verify archive** - All executed prompts should be in `archive/`, only MANIFEST.md remains at top level

### Demo Build Standards Check

After the last prompt in a batch, verify the project meets Demo Build Standards (see CLAUDE.md):

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | `docker-compose.yml` exists | File present at project root |
| 2 | `docker compose up` works | Run it — app starts without errors |
| 3 | `.env.example` exists | File present with all variables documented |
| 4 | `GET /health` returns `{"status": "ok"}` | `curl localhost:{port}/health` |
| 5 | No stack traces visible to users | Trigger an error (bad input, kill backend) — UI shows friendly message |
| 6 | App boots with data | First run shows content, not empty screens |
| 7 | Terraform has `default_tags` | Check provider block for `Project` tag |

Report any failures. These are cheaper to fix now than at packaging time.
