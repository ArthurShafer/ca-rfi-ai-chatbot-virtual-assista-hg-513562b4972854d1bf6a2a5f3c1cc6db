---
name: find-skills
description: "Discover and install skills from skills.sh ecosystem. Use when you need specialized capabilities not in core skills."
---

# Find Skills

## Overview

Discover and install specialized skills from the open agent skills ecosystem at skills.sh. Use this when core skills don't cover a specific need.

## When to Use

- Need specialized capability not in core skills
- User asks "how do I do X" for unfamiliar domain
- Integration with specific APIs or services
- Domain-specific tooling (testing frameworks, deployment, etc.)

## Commands

```bash
# Search for skills
npx skills find [query]

# Install a skill (globally, auto-yes)
npx skills add <owner/repo@skill> -g -y

# Check for updates
npx skills check

# Update installed skills
npx skills update
```

## Workflow

### 1. Identify Need
Determine what capability is missing:
- Domain (React, testing, deployment, API)
- Specific task (authentication, database migration, etc.)

### 2. Search
```bash
npx skills find "your query"
```

### 3. Evaluate
Before installing, consider:
- Is this a one-time need or recurring?
- Does it overlap with existing core skills?
- Is the skill well-maintained?

### 4. Install with Tracking
If installing, update the manifest:

```yaml
# Add to .claude/skills/MANIFEST.yaml under 'discovered:'
- name: skill-name
  source: owner/repo@skill
  installed: 2026-02-08
  reason: "Why this was needed"
  last_used: 2026-02-08
  campaigns: []
  keep: false  # Default to cleanup candidate
```

### 5. Use
Load the skill for the task at hand.

## Bloat Prevention

**Tiered structure:**
- `contracts/.claude/skills/` - Core skills (permanent)
- `{campaign}/.claude/skills/` - Campaign-specific (auto-cleanup)

**Cleanup rules:**
- Discovered skills default to `keep: false`
- Review skills not used in 30+ days
- Campaign skills deleted with campaign archive

**Before installing globally, ask:**
1. Will this be used across multiple campaigns?
2. Does it belong in core skills?
3. Or should it be campaign-specific?

## Periodic Cleanup

Monthly, run cleanup review:

1. Check `discovered:` skills in MANIFEST.yaml
2. For each skill with `keep: false` and no recent use:
   - Remove skill directory
   - Move entry to `audit_log:`
3. For skills used regularly, set `keep: true`

## Browse Available Skills

https://skills.sh/

## Integration with Workflow

When executing implementation prompts that specify unknown skills:
1. Check if skill exists locally
2. If not, use find-skills to search
3. Confirm with user before installing
4. Update manifest
5. Continue execution
