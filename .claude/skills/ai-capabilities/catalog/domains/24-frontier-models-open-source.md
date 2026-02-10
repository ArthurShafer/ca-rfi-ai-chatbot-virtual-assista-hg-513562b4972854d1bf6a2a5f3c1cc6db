# Frontier Models (Open Source)

**Category**: Frontier Models
**Maturity**: Growing
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

High-capability AI models with publicly released weights that can be self-hosted, fine-tuned, and deployed without API dependencies. "Open source" in the AI context ranges from fully open (weights, training code, and data) to "open weights" (model weights released but training details withheld). These models have rapidly closed the gap with proprietary models, with the top open models now within 0.3% of proprietary models on MMLU benchmarks.

## Why It Matters

Open-source models solve government's three biggest AI concerns: data sovereignty (data never leaves agency infrastructure), vendor lock-in (no dependency on a single API provider), and cost predictability (fixed infrastructure costs rather than per-token pricing). When a state agency says "our data cannot leave our network," open-source models are the answer. This is increasingly common in healthcare, law enforcement, and social services agencies.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Llama 4 (Meta) | Foundation model | Free (open weights) | 405B, 70B, 8B sizes. Strong all-around. Most popular open model family. |
| DeepSeek-R1 | Reasoning model | Free (open weights) | Cost only $6M to train. Strong reasoning, competitive with o1. Distilled versions available. |
| Qwen3 (Alibaba) | Foundation model | Free (open weights) | Strong multilingual. 72B competitive with GPT-4. Active development. |
| Mistral Large 3 | Foundation model | Free (open weights) | European AI lab. Strong coding and reasoning. 128K context. |
| Gemma 3 (Google) | Efficient model | Free (open weights) | 2B, 9B, 27B sizes. Designed for efficiency. Good for edge deployment. |
| Phi-4 (Microsoft) | Small efficient model | Free (open weights) | 14B parameters. Punches above weight. Good for constrained environments. |
| Together AI | Inference platform | $0.20-2/1M tokens | Host open models without managing infrastructure. Fine-tuning available. |
| Ollama | Local model runner | Free (open source) | Run open models locally with one command. CPU and GPU support. |
| vLLM | Inference server | Free (open source) | High-throughput inference. Production-grade. PagedAttention for efficiency. |

## How It Fits Your Workflow

- **Kanban 1 (Demo Dev)**: Build demos that can run on open-source models for agencies with air-gapped or data-sovereign requirements. "This system runs entirely on your infrastructure with Llama 4."
- **Kanban 2 (Teaming)**: "We can deploy on open-source models" is a teaming advantage. Partners targeting government healthcare or law enforcement need this capability.
- **Proposals**: Offer a deployment matrix: "Cloud API for development and non-sensitive data. Self-hosted open-source for sensitive workloads. Same application, different model backend."
- **Cost Optimization**: Open models on Together AI or self-hosted can be 5-10x cheaper than proprietary APIs for high-volume, lower-complexity tasks.

## Current State of the Art

Llama 4 (405B) achieves within 2-3% of Claude Opus on most benchmarks. The 70B version runs on a single high-end GPU server. The 8B version runs on consumer hardware. This size range covers everything from edge deployment to near-frontier capability.

DeepSeek-R1, built for only $6M (compared to hundreds of millions for competing models), demonstrated that reasoning capabilities can be achieved efficiently. Its distilled versions (7B, 14B, 32B) bring reasoning to smaller deployments.

The MMLU gap between top open (Llama 4 405B, Qwen3 72B) and top proprietary (Claude Opus 4.6, GPT-5.2) has narrowed to ~0.3%. For many practical tasks, the difference is indistinguishable. Where proprietary models still lead: complex multi-step reasoning, long-context accuracy, tool use reliability, and safety alignment.

Self-hosting costs have dropped. A Llama 4 70B instance on AWS (p4d.24xlarge) costs ~$15-20/hour, or about $0.50-1/1M tokens at typical throughput. This is competitive with proprietary API pricing for sustained high-volume workloads.

Quantization (reducing model precision from float16 to int4/int8) enables running larger models on smaller hardware with 5-10% quality loss. GGUF format and llama.cpp have standardized this for local deployment.

## Learning Path

1. **Run Llama 4 8B locally with Ollama** - `ollama run llama4:8b`. Experience the capability gap (or lack thereof) versus API models for simple tasks. This builds intuition for when open models are sufficient.
2. **Deploy a model on Together AI** - Use their serverless inference for a demo project. Test Llama 4 70B against Claude Sonnet on your actual use cases. Compare quality and cost.
3. **Study the DeepSeek-R1 technical report** - Understanding how reasoning was achieved efficiently informs your proposals when agencies ask about model training and capability.

## Notes

