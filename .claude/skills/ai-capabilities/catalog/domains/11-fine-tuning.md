# Fine-Tuning

**Category**: Architecture Patterns
**Maturity**: Mature
**Relevance**: Medium
**Last Updated**: 2026-02-09

## What It Is

Fine-tuning is the process of training a pre-trained language model on domain-specific data to adjust its behavior, knowledge, or style. Unlike RAG (which provides context at query time), fine-tuning permanently modifies model weights to embed specialized knowledge or behavioral patterns. Techniques range from full fine-tuning (expensive, modifies all parameters) to parameter-efficient methods like LoRA and QLoRA that modify a small fraction of weights.

## Why It Matters

Fine-tuning is relevant when you need consistent behavioral changes that prompting alone cannot achieve: specific output formats, domain terminology, writing style matching agency language, or classification tasks at high throughput. For government contracting, fine-tuning's primary value is creating specialized classifiers (like your TechClassifier for opportunity scoring) and adapting models to speak in government-specific language patterns for proposals.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| OpenAI Fine-Tuning | Managed service | $8/1M tokens training (GPT-4o-mini) | Easiest path. Upload JSONL, get fine-tuned model. Limited to OpenAI models. |
| Anthropic Fine-Tuning | Managed service | Custom pricing (enterprise) | Available for Claude models. Contact sales. Less accessible than OpenAI. |
| AWS Bedrock Fine-Tuning | Managed service | Varies by model | Fine-tune Llama, Titan models on AWS. Integrates with your existing AWS infrastructure. |
| Hugging Face AutoTrain | Managed training | $0.50/min GPU | No-code fine-tuning. Upload data, select model, get results. Good for experimentation. |
| Unsloth | Training accelerator | Free (open source) | 2x faster LoRA/QLoRA training. Reduced memory usage. Best for local fine-tuning. |
| Axolotl | Training framework | Free (open source) | Config-driven fine-tuning. Supports many techniques (LoRA, QLoRA, full). |
| Together AI | Managed fine-tuning | $2-8/1M tokens | Fine-tune open-source models (Llama, Mistral). Deployed on their inference platform. |
| Modal | Serverless GPU | $0.80-2.50/hr GPU | Run fine-tuning jobs without managing infrastructure. Pay only for compute used. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: The TechClassifier could be implemented as a fine-tuned model instead of rule-based logic. A fine-tuned classifier on 500+ labeled opportunities would be more accurate and require less maintenance than keyword tiers.
- **Kanban 1 (Demo Dev)**: Fine-tuned models as a demo offering. "We fine-tuned a model on your agency's 10 years of case records to classify new submissions." Compelling demo for document-heavy agencies.
- **Proposals**: Use fine-tuning to match agency writing style. Train on successful past proposals to generate first drafts that sound like a human wrote them for that specific audience.
- **Decision Logging**: Decision logs accumulate training data over time. Eventually, a fine-tuned model could replicate your go/no-go patterns for opportunity triage.

## Current State of the Art

LoRA and QLoRA have made fine-tuning accessible on consumer hardware. A 7B parameter model can be fine-tuned on a single GPU with 16GB VRAM in a few hours. Cost for a typical fine-tuning run: $5-50 depending on dataset size and model.

The decision framework for RAG vs. fine-tuning has crystallized: use RAG when the knowledge changes frequently or when you need source attribution. Use fine-tuning when you need consistent behavioral changes, specific output formats, or high-throughput classification. In practice, 80% of enterprise use cases are better served by RAG; fine-tuning is for the remaining 20% where behavior, not knowledge, needs to change.

OpenAI's fine-tuning has become straightforward: 50-100 high-quality examples can produce meaningful behavioral changes. For classification tasks, 200-500 labeled examples typically achieve 90%+ accuracy.

A key caution: fine-tuned models lose capability on tasks outside their fine-tuning distribution. Overly narrow fine-tuning degrades general performance. The best approach is minimal fine-tuning focused on specific behavioral adjustments.

## Learning Path

1. **Start with OpenAI fine-tuning** - Prepare 100 labeled examples (e.g., opportunity descriptions with relevance scores), fine-tune GPT-4o-mini, evaluate accuracy. Total cost: under $10.
2. **Explore LoRA on open-source models** - Use Unsloth to fine-tune Llama 3.2 locally. This builds understanding of the mechanics and prepares you for air-gapped government deployments.
3. **Read "When to Fine-Tune vs RAG" guides** - Anthropic's cookbook and OpenAI's fine-tuning documentation both have excellent decision frameworks.

## Notes

