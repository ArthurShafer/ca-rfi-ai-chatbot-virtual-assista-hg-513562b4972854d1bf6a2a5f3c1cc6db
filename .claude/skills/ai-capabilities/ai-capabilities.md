# AI Capabilities Assessment

Consult the AI capabilities catalog to suggest relevant technologies, tools, and patterns for the current task. Use during brainstorming, architecture decisions, demo design, and technology evaluation.

## When to Use This Skill

- Starting a capture campaign brainstorm involving technology choices
- Evaluating AI technology options for an RFP response
- Designing demo architecture (choosing between RAG, agents, etc.)
- Comparing build vs buy for AI components
- Answering "what AI tools could help with X?"
- Learning about a specific AI domain

## How to Use the Catalog

The catalog lives at `.claude/skills/ai-capabilities/catalog/`:

1. **Start with INDEX.md** — Read the master taxonomy to understand all 45 domains across 8 categories with maturity and relevance ratings
2. **Identify relevant domains** — Based on the current task, pick 2-5 domains that apply
3. **Load domain files** — Read only the relevant `domains/XX-name.md` files (NOT all 45)
4. **Present capabilities** — Suggest tools, patterns, and approaches with costs and maturity levels
5. **Connect to workflow** — Map suggestions to specific workflow phases (Phase 1 dashboard, Kanban 1 demo dev, Kanban 2 teaming, etc.)

## Catalog Structure

```
catalog/
├── INDEX.md          # Master taxonomy — always read this first
├── sources.md        # Curated news sources for daily monitoring
├── domains/          # 45 domain files with tools, costs, learning paths
│   ├── 01-ai-code-editors.md
│   ├── ...
│   └── 45-ai-project-management.md
└── briefs/           # Daily and weekly brief archives
```

## 8 Domain Categories

| # | Category | Domains | Focus |
|---|----------|---------|-------|
| 1 | Development & Productivity | 1-8 | Code editors, copilots, agents, testing, DevOps |
| 2 | Architecture Patterns | 9-16 | RAG, vector DBs, agents, MCP, function calling |
| 3 | Infrastructure & Ops | 17-22 | Observability, evaluation, guardrails, cost optimization |
| 4 | Frontier Models | 23-28 | Proprietary, open source, reasoning, multimodal, edge |
| 5 | Enterprise Applications | 29-34 | Document intelligence, knowledge mgmt, workflow automation |
| 6 | Content & Communication | 35-37 | Content creation, voice AI, video generation |
| 7 | Governance & Compliance | 38-40 | AI governance, regulations, government adoption |
| 8 | Ecosystem & Platforms | 41-45 | Marketplaces, integration platforms, no-code, collaboration |

## Presentation Format

When suggesting AI capabilities, present them as:

| Capability | Tool(s) | Cost | Maturity | Fit |
|-----------|---------|------|----------|-----|
| {what it does} | {specific tools} | {pricing} | {level} | {how it helps this specific task} |

Always include:
- **Cost** — Monthly/per-use pricing
- **Maturity** — Emerging, Growing, Mature, or Commoditized
- **Relevance** — Why this matters for the specific task at hand
- **Trade-offs** — What you gain vs what it costs in complexity/money

## Context

**Owner**: Arthur Shafer, Easy Company Cloudworks LLC
**Market**: New England state government contracts (ME, NH, VT, MA, RI, CT)
**Focus**: AI/ML, AWS, web development, digital transformation
**Workflow**: Solo operator using progressive automation — every decision logged for future agent training
