# AI Coding Agents (Autonomous)

**Category**: Development & Productivity
**Maturity**: Emerging
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

Autonomous coding agents that can plan, implement, test, and iterate on software without continuous human supervision. Unlike copilots (reactive suggestions) or pair programming (interactive collaboration), coding agents take a task description and execute end-to-end, making architectural decisions, writing code across multiple files, running tests, and self-correcting errors. They can operate for 30+ hours on complex tasks autonomously.

## Why It Matters

This is the category that most directly multiplies a solo operator's capacity. An autonomous coding agent effectively gives you a junior-to-mid-level developer who works 24/7. For government contracting, this means you can pursue more solicitations simultaneously, build more sophisticated demos, and deliver contract work faster. The cost-per-feature drops dramatically: a $500/mo agent subscription replaces significant contractor costs.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Claude Code | CLI agent | Included with Claude Pro ($20/mo) or API usage | Anthropic's official CLI. Runs in terminal. Full file system access, git integration, tool use. Your primary tool. |
| Devin (Cognition) | Cloud agent | $500/mo | First "AI software engineer." Operates in cloud sandbox. Can deploy, browse web, use terminal. Stronger on greenfield projects. |
| OpenAI Codex CLI | CLI agent | API usage (GPT-4 pricing) | Open-source CLI agent. Similar to Claude Code but uses OpenAI models. Sandboxed execution. |
| Cline | VS Code extension | Free (open source) + API costs | Autonomous mode in VS Code. Plans and executes multi-step tasks. Good at using MCP tools. |
| Aider | CLI agent | Free (open source) + API costs | Git-aware coding agent. Strong at incremental changes to existing codebases. Architect + editor mode. |
| SWE-Agent | Research agent | Free (open source) | Princeton research project. Strong on SWE-bench. Less production-ready. |
| Bolt.new | Browser agent | $20/mo Pro | Full-stack app generation in browser. Deploys to cloud. Good for rapid prototypes. |

## How It Fits Your Workflow

- **Kanban 1 (Demo Dev)**: Core of the autonomous execution loop. Implementation prompts feed directly into Claude Code for unattended execution. Agent builds feature, runs tests, reports results. Human reviews at checkpoints.
- **Phase 1 (Dashboard)**: Claude Code handles scraper development, API endpoint creation, and UI iterations autonomously between review sessions.
- **Phase 4 (Execution)**: Bulk of contract deliverable coding done by agents, with human review at merge points.
- **Decision Logging**: Agent decisions during autonomous execution become training data for further automation.

## Current State of the Art

Claude Opus 4.6 leads SWE-bench Verified at 80.8% resolution rate, meaning it can autonomously fix 4 out of 5 real-world GitHub issues. Devin scores similarly on sustained multi-hour tasks. The key breakthrough in late 2025 and early 2026 was reliability: agents now successfully complete 70-85% of well-specified tasks without human intervention.

The practical limit remains task specification quality. Vague instructions produce vague results. The implementation prompt format (with dependencies, skills, scope) was designed specifically to feed these agents well-structured work.

Cost efficiency is improving rapidly: a complex feature that costs $5-15 in API tokens would take a human developer 4-8 hours. At $150/hr contractor rates, the economics are 50-100x in favor of agents for suitable tasks.

Multi-agent collaboration is emerging but not yet production-ready. Current best practice is sequential agent execution with human checkpoints between phases.

## Learning Path

1. **Claude Code deep dive** - You already use this. Focus on mastering the skill system, CLAUDE.md project instructions, and autonomous mode with checkpoints. Anthropic docs: https://docs.anthropic.com/en/docs/claude-code
2. **Aider for comparison** - Install Aider (`pip install aider-chat`) and try the same task with both tools. Understanding different agent approaches improves your prompting for all of them.
3. **SWE-bench analysis** - Read the SWE-bench papers to understand what makes tasks agent-friendly vs. agent-hostile. This directly informs how you write implementation prompts.

## Notes

