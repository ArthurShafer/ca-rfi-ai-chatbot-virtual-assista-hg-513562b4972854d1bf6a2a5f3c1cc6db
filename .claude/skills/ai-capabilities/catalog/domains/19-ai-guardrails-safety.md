# AI Guardrails & Safety

**Category**: Infrastructure & Operations
**Maturity**: Emerging
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

Systems and tools that constrain AI behavior within defined boundaries, preventing harmful outputs, enforcing compliance policies, blocking prompt injection attacks, and ensuring AI systems operate within their intended scope. Guardrails sit between user input and model output, filtering both directions to maintain safety, accuracy, and regulatory compliance.

## Why It Matters

Government AI systems cannot produce harmful, biased, or non-compliant outputs. A single failure -- a chatbot sharing PII, generating biased recommendations, or responding to a prompt injection attack -- can result in contract termination and reputational damage. The EU AI Act (effective August 2026) mandates risk classification and guardrails for AI systems. State governments are following with their own requirements. Guardrails transform from "nice to have" to "legally required."

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| NeMo Guardrails (NVIDIA) | Guardrail framework | Free (open source) | Define guardrails in natural language (Colang). Topic control, fact-checking, output filtering. Production-ready. |
| LLM Guard | Input/output filter | Free (open source) | Scans for PII, toxicity, prompt injection, invisible characters. Fast (~50ms per check). |
| Guardrails AI | Validation framework | Free (open source), $50/mo Hub | Pydantic-based validators for LLM outputs. Hallucination check, PII removal, format validation. |
| Anthropic Constitutional AI | Built into Claude | Included | Claude's built-in safety. Constitutional AI approach. Strongest built-in guardrails of any model. |
| Amazon Bedrock Guardrails | Managed service | $0.75/1K text units | AWS-native. Content filtering, PII redaction, topic avoidance. Integrates with Bedrock Agents. |
| Rebuff | Prompt injection defense | Free (open source) | Detects prompt injection attempts. Multi-layered detection (heuristics, LLM-based, canary tokens). |
| Lakera Guard | API security | Free tier, custom enterprise | Real-time prompt injection detection API. 100K+ free requests/month. |

## How It Fits Your Workflow

- **Kanban 1 (Demo Dev)**: Every government AI demo needs visible guardrails. Show evaluators: "The system blocks PII from appearing in outputs, prevents off-topic responses, and logs all blocked content for review." This is a competitive differentiator.
- **Proposals**: Include guardrail architecture in every technical approach. Reference NeMo Guardrails or Bedrock Guardrails by name. Government evaluators look for this.
- **Phase 4 (Execution)**: Production systems need layered guardrails: input validation (prompt injection defense), output validation (PII, toxicity, hallucination), and behavioral guardrails (topic control, action limits).
- **Regulatory Compliance**: EU AI Act categorizes government AI systems as "high risk," requiring documented guardrails, testing, and monitoring. Start building this into every system now.

## Current State of the Art

NeMo Guardrails has become the most popular open-source guardrail framework. Its Colang language lets you define guardrails in near-natural language: "if the user asks about politics, politely decline and redirect to the system's purpose." Processing overhead is typically 100-200ms per interaction.

Prompt injection defense has matured significantly. Multi-layered approaches (input scanning, system prompt hardening, output validation, canary tokens) block 95%+ of known injection patterns. The remaining 5% are novel attacks that require regular red-teaming to discover.

Amazon Bedrock Guardrails provides the most production-ready managed solution for AWS deployments. It handles content filtering (customizable categories and thresholds), PII redaction (with configurable handling: block, mask, or anonymize), topic avoidance (define denied topics), and word filters. Cost is predictable and reasonable for government budgets.

The key insight: guardrails are defense in depth. No single tool catches everything. Production systems layer: Claude's built-in safety, input scanning (LLM Guard), behavioral guardrails (NeMo), output validation (Guardrails AI), and monitoring (Langfuse). Each layer catches what others miss.

PII detection accuracy for structured PII (SSN, phone, email) exceeds 99%. For unstructured PII (names, addresses in free text), accuracy is 90-95%, requiring human review for high-stakes applications.

## Learning Path

1. **Implement Bedrock Guardrails** on your next demo that uses Bedrock. Configure content filtering and PII redaction. Show the guardrail blocking inappropriate content in your demo walkthrough.
2. **Add LLM Guard** to your Python applications. It takes 10 minutes to add input/output scanning. Focus on prompt injection and PII detection.
3. **Study the EU AI Act requirements** for high-risk AI systems. These requirements will increasingly appear in state government RFPs as agencies align with emerging standards.

## Notes

