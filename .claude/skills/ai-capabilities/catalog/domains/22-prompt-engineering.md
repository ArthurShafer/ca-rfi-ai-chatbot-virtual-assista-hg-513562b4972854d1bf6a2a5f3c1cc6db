# Prompt Engineering & Structured Outputs

**Category**: Infrastructure & Operations
**Maturity**: Mature
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

The discipline of designing inputs to LLMs to reliably produce desired outputs. This ranges from simple prompt templates to sophisticated techniques like chain-of-thought reasoning, few-shot examples, system prompts, and structured output schemas. In 2026, prompt engineering has evolved from "writing good prompts" to "writing specifications": defining exactly what you want in JSON schemas, XML structures, or detailed system instructions that leave no ambiguity.

## Why It Matters

Prompt engineering is the interface between your intent and AI capability. The difference between a vague prompt and a well-engineered one is the difference between a 60% and a 95% success rate on the same task. For government contracting, where AI outputs must be reliable and consistent, prompt engineering is a core competency. It is also the skill that makes all other AI capabilities work well: RAG, agents, coding, analysis.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Anthropic Console | Prompt playground | Free with API key | Test prompts interactively. System prompts, tool definitions, variable substitution. |
| OpenAI Playground | Prompt playground | Free with API key | Similar to Anthropic Console. Temperature, top-p controls. |
| Promptfoo | Prompt testing | Free (open source) | Test prompts against multiple models and datasets. Assert on output quality. CI integration. |
| Anthropic Structured Outputs | API feature | Included in API | Guaranteed JSON schema compliance. No parsing errors. Define output shape with JSON Schema. |
| Instructor (Python) | Structured output library | Free (open source) | Pydantic models as output schemas. Automatic retry on validation failure. Works with Claude and GPT. |
| LMQL | Prompt programming | Free (open source) | Programming language for LLM interactions. Constraints, control flow, type checking. |
| DSPy | Prompt optimization | Free (open source) | Automatically optimizes prompts via examples. Compiles natural language programs into effective prompts. |
| Braintrust | Prompt management | Free tier | Version control for prompts. A/B testing. Deployment management. |

## How It Fits Your Workflow

- **Every Phase**: Prompt engineering is embedded in everything. Your CLAUDE.md is a system prompt. Your implementation prompts are prompts. Your skill files are prompt templates. The quality of these directly determines output quality.
- **Phase 1 (Dashboard)**: TechClassifier prompts for opportunity scoring. Well-engineered classification prompts with clear categories, examples, and edge case handling.
- **Kanban 1 (Demo Dev)**: Implementation prompts with metadata (order, dependencies, skills, scope) are structured prompt engineering. The format ensures agents receive the right context.
- **Proposals**: Describe your prompt engineering methodology in technical approaches. "We use structured output schemas, few-shot examples, and automated prompt testing to ensure 95%+ reliability."

## Current State of the Art

Structured outputs have become the default for production applications. Both Anthropic and OpenAI guarantee JSON schema compliance in their APIs, eliminating the "parsing LLM output" problem that plagued earlier systems. Define your Pydantic model or JSON Schema, and the output exactly matches it.

Chain-of-thought prompting has been internalized by frontier models: Claude and GPT-4 reason step-by-step by default on complex tasks. Explicitly requesting chain-of-thought ("think step by step") still helps on some tasks but is less necessary than in 2024.

The shift from "prompt engineering" to "prompt specification" reflects the maturity: you are not tricking the model into giving good answers, you are clearly specifying what you want. System prompts are now treated as software specifications: version controlled, tested, and reviewed.

Model-specific prompt optimization remains important. Claude responds best to clear, direct instructions with examples and XML-tagged sections. GPT models respond well to role-based prompts and JSON mode. Each model has its sweet spot.

DSPy represents the frontier of automated prompt optimization: given a set of examples, it automatically discovers the prompt format, few-shot examples, and chain-of-thought structure that maximizes accuracy. This is particularly useful when you need to optimize prompts for a specific domain without manual iteration.

Key technique: XML tags for structuring complex prompts. Claude specifically was trained to understand `<context>`, `<instructions>`, `<examples>`, and `<output_format>` tags. Using these consistently improves output quality by 10-15%.

## Learning Path

1. **Study Anthropic's prompt engineering guide** - The most comprehensive guide to prompting Claude. Focus on: system prompts, XML tags, chain-of-thought, and tool definitions. https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering
2. **Set up Promptfoo** for testing your critical prompts (TechClassifier, opportunity analysis, proposal generation). Automated testing catches regression when you update prompts.
3. **Explore DSPy** for automated prompt optimization. Start with a classification task, provide 50 labeled examples, and let DSPy find the optimal prompt structure.

## Notes

