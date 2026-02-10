# AI Observability & Monitoring

**Category**: Infrastructure & Operations
**Maturity**: Emerging
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

Specialized monitoring and debugging tools for AI/LLM applications. Traditional APM (Application Performance Monitoring) tracks HTTP requests and database queries. AI observability tools track LLM calls, prompt/completion pairs, token usage, latency, cost, tool use chains, and evaluation metrics. They provide visibility into what your AI is doing, why it made specific decisions, and where it is failing.

## Why It Matters

When you deploy an AI system for a government agency, you need to answer: "What did the AI do and why?" AI observability tools provide the audit trail. They also catch issues before users do: hallucinations, latency spikes, cost overruns, and degraded accuracy. For a solo operator, observability replaces the team of QA engineers you do not have.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Langfuse | Open-source observability | Free (self-hosted), Cloud free tier, $59/mo Pro | Best open-source option. Traces, scores, dashboards. LangChain/LlamaIndex integration. |
| Braintrust | Eval + observability | Free tier, custom pricing | Combined evaluation and monitoring. Strong prompt playground. Real-time scoring. |
| Arize Phoenix | Open-source observability | Free (open source) | LLM traces, evaluations, embeddings analysis. Strong debugging capabilities. |
| LangSmith | LangChain observability | Free tier, $39/mo Plus | Official LangChain tracing. Deep integration with LangGraph agent workflows. |
| Helicone | Proxy-based monitoring | Free tier, $20/mo Pro | Drop-in proxy between your app and LLM APIs. Zero-code integration. Cost tracking. |
| Weights & Biases (Weave) | ML observability | Free tier, $50/mo Teams | End-to-end ML monitoring including LLM apps. Strong experiment tracking. |
| Datadog LLM Observability | Enterprise monitoring | Per-host pricing (~$23/host/mo+) | Enterprise APM with LLM-specific dashboards. Good for organizations already on Datadog. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: Monitor scraper performance, LLM scoring calls, and API usage. Track HigherGov API consumption against the 300 records/day budget.
- **Kanban 1 (Demo Dev)**: Every demo you build for a government agency should include observability. "Here's the dashboard showing every AI decision, its reasoning, and its accuracy score." This addresses trust concerns.
- **Cost Consciousness**: Track token usage across all LLM calls. Helicone or Langfuse show exactly which features cost the most, enabling targeted optimization.
- **Phase 4 (Execution)**: Production AI systems need monitoring. Langfuse or Arize Phoenix self-hosted for government deployments where data cannot leave the agency's infrastructure.

## Current State of the Art

Langfuse has emerged as the community standard for open-source LLM observability. Its trace model captures the full execution graph: user input, LLM calls, tool use, retrievals, and final output, with scoring and evaluation at each step. Self-hosted deployment addresses government data sovereignty requirements.

The proxy-based approach (Helicone) offers the lowest-friction integration: change one line of code (the API base URL) and get full observability. This is valuable for rapid deployment but less flexible than SDK-based approaches for complex agent workflows.

Key metrics to track in production AI systems: latency (p50/p95/p99), token usage per request, cost per request, error rate, hallucination rate (via automated evaluation), and user satisfaction (via feedback signals).

The integration of evaluation into observability (Braintrust, Langfuse scores) represents a maturation of the space. Instead of separate monitoring and evaluation pipelines, production systems continuously evaluate output quality and alert on degradation.

## Learning Path

1. **Set up Langfuse** (cloud free tier) on your next demo project. Add tracing to your LLM calls and see the full execution graph. Takes 30 minutes to integrate.
2. **Add Helicone** as a proxy for your daily Claude API usage. See your token costs, latency patterns, and most expensive prompts. One line of code change.
3. **Study the OpenTelemetry + LLM observability** convergence. OTel is becoming the standard for AI application tracing, and understanding it positions you well for enterprise proposals.

## Notes

