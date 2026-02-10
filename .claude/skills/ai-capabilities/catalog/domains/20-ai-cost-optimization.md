# AI Cost Optimization

**Category**: Infrastructure & Operations
**Maturity**: Growing
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

Strategies, tools, and architectural patterns for reducing the cost of AI/LLM operations while maintaining quality. This includes prompt caching (reusing computed context), model routing (sending requests to the cheapest capable model), response caching, batch processing, prompt optimization (shorter prompts that maintain quality), and infrastructure right-sizing. The goal is making AI systems economically viable at scale.

## Why It Matters

AI costs are the primary barrier to government adoption. When a state CIO hears "this system costs $5,000/month in API calls," the project dies. Cost optimization is what makes AI proposals economically defensible. For your own operations, cost discipline means you can pursue more opportunities simultaneously and maintain more demos without burning through API credits. The 70-80% of workloads that can run on mid-tier models represent massive savings.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Anthropic Prompt Caching | API feature | 90% savings on cached tokens | Cache system prompts, tool definitions, and large context. Dramatic savings for repeated contexts. |
| OpenAI Batch API | Batch processing | 50% discount | Process non-urgent requests in batch. 24-hour turnaround. Good for document processing. |
| Anthropic Message Batches | Batch processing | 50% discount | Same concept as OpenAI batch. Process large volumes at half price. |
| OpenRouter | Model routing | Per-token (various models) | Route requests to cheapest capable model. Compare pricing across 100+ models. |
| Martian | Smart routing | Per-request | AI-powered model selection. Picks the cheapest model that can handle each request. |
| LiteLLM | Proxy/router | Free (open source) | Unified API for 100+ LLM providers. Fallback, load balancing, cost tracking. |
| Portkey | AI gateway | Free tier, $49/mo Growth | Caching, routing, fallback, cost analytics. Enterprise-ready proxy layer. |
| Amazon Bedrock (cross-region) | Managed inference | Varies by model | Cross-region inference for cost optimization. Spot-like pricing for non-urgent workloads. |

## How It Fits Your Workflow

- **Every Phase**: Cost consciousness is a core value. Every implementation prompt estimates token costs. Every batch execution shows total cost before approval.
- **Phase 1 (Dashboard)**: Model routing for opportunity analysis. Use Claude Haiku ($0.25/1M input) for initial scoring, escalate to Sonnet ($3/1M input) only for ambiguous cases. 80% savings on scoring.
- **Kanban 1 (Demo Dev)**: Prompt caching for development sessions. Your CLAUDE.md and skill files are cached context that does not need re-processing. This saves significant tokens in long sessions.
- **Proposals**: Include cost projections in every technical approach. Show the agency: "Month 1: $X at launch scale. Month 6: $Y at 10x scale. Here's how costs scale sub-linearly thanks to caching and routing."
- **Production Systems**: Tiered model architecture: fast/cheap model for routing, mid-tier for most tasks, frontier for complex reasoning. Government agencies love predictable cost models.

## Current State of the Art

Prompt caching has been the single largest cost reduction since its introduction. Anthropic's implementation caches the first portion of messages, saving 90% on subsequent requests that share the same prefix. For applications with large system prompts (tool definitions, instructions, context), this often means 50-70% total cost reduction.

Model routing is maturing rapidly. The principle: 70-80% of LLM requests do not need a frontier model. A well-designed router sends simple classification, extraction, and formatting tasks to small models (Haiku, GPT-4o-mini, Gemini Flash) at 10-20x lower cost, reserving frontier models (Opus, GPT-4, Gemini Pro) for complex reasoning.

Batch processing at 50% discount is the easiest optimization for non-real-time workloads. Document processing, nightly analysis, report generation, and bulk classification all benefit from batch APIs.

Response caching (storing and reusing LLM outputs for identical or similar requests) provides another 20-40% savings for applications with repetitive queries. Redis or simple in-memory caches work well.

The total cost reduction from applying all techniques (caching + routing + batching + prompt optimization) is typically 70-85% compared to naive implementation. A system that costs $10,000/month naively can often be optimized to $1,500-3,000/month.

## Learning Path

1. **Enable prompt caching** on all your Claude API calls. Anthropic's documentation shows how to set cache breakpoints. Monitor cost reduction in your Helicone/Langfuse dashboard.
2. **Implement model routing** for your dashboard. Set up LiteLLM as a proxy, route scoring to Haiku, analysis to Sonnet, complex reasoning to Opus. Measure quality and cost at each tier.
3. **Build a cost model spreadsheet** for proposals. Input: request volume, complexity distribution, caching hit rate. Output: monthly cost projection. Reuse across proposals.

## Notes

