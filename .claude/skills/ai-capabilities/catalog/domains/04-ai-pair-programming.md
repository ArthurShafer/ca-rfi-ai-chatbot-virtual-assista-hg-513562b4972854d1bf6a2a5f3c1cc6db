# AI Pair Programming

**Category**: Development & Productivity
**Maturity**: Growing
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

Interactive, conversational coding where a developer and an AI work together in real-time on the same codebase. Unlike autonomous agents (which work independently) or copilots (which offer passive suggestions), pair programming involves active dialogue: the developer describes intent, the AI proposes implementations, the developer refines, and both iterate until the solution is right. This is the "interactive review session" in your workflow.

## Why It Matters

Pair programming with AI combines the strengths of human judgment (architecture decisions, UX intuition, domain knowledge) with AI speed (code generation, refactoring, testing). For government demos, this is where quality happens: the brainstorming phase that produces the right architecture, the review session that polishes the demo to professional quality. It is also the primary mode for decision logging, as every refinement is a decision worth capturing.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Cursor Composer | IDE feature | $20/mo (Cursor Pro) | Multi-file editing via conversation. Best for "show me how this looks" iterations. |
| Claude Code (interactive) | CLI tool | Included with Claude Pro/API | Your primary pair programming tool. Full codebase context, file editing, terminal access. |
| GitHub Copilot Chat | IDE extension | $10-19/mo | Inline chat in VS Code. Good for quick questions and small edits. Less capable for multi-file work. |
| Cline (manual mode) | VS Code extension | Free + API costs | Step-by-step execution with approval gates. Good for learning what the AI is doing. |
| Aider (chat mode) | CLI tool | Free + API costs | Git-aware chat. Each exchange is a clean commit. Good for maintaining clean history. |
| Claude.ai Artifacts | Web app | $20/mo Pro | Real-time preview of generated code. Good for UI component prototyping before moving to IDE. |

## How It Fits Your Workflow

- **Brainstorming**: The brainstorming skill is pair programming at the design level. You describe what you need, AI proposes approaches, you shape the direction together. Produces design docs and implementation prompts.
- **Kanban 1 (Demo Dev)**: Interactive review sessions are pair programming. Walk through the demo, call out issues, AI fixes immediately. This is where demos go from "functional" to "impressive."
- **Decision Logging**: Every exchange in a pair programming session is a potential decision log entry. The AI can prompt you: "Should I log this design choice?"
- **Skill Development**: Building and refining skills is inherently pair programming work. You describe what the skill should do, iterate on the content together.

## Current State of the Art

The quality gap between AI pair programming tools has narrowed significantly. The differentiator is now context management: how much of your codebase the AI understands at any given moment. Cursor Composer indexes your entire workspace. Claude Code reads files on demand but maintains conversation context across a session. Both approaches have trade-offs.

Effective pair programming with AI requires a different rhythm than human-human pairing. Best practices that have emerged: describe intent before implementation, use "think step by step" for complex logic, review in small increments, and explicitly state constraints ("must work with our existing auth system").

The most productive developers report spending 60-70% of coding time in pair programming mode (interactive) and 30-40% in agent mode (autonomous), with the split depending on task novelty. Novel features benefit from pair programming; repetitive implementation benefits from autonomous agents.

## Learning Path

1. **Develop a rhythm with Claude Code** - Practice the cycle: describe intent, review proposal, refine, accept. Learn when to be specific ("use a Map instead of an Object here") vs. general ("make this more performant").
2. **Master Cursor Composer** - For UI work, Composer's ability to show changes across files simultaneously is powerful. Practice with multi-component refactoring tasks.
3. **Read "Pair Programming with AI" patterns** - The community has developed patterns like "rubber duck escalation" (start by explaining, let AI ask questions) and "sketch then fill" (describe the shape, let AI fill details).

## Notes

