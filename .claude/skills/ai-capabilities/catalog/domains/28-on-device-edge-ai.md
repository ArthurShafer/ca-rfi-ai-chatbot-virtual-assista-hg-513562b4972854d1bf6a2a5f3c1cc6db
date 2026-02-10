# On-Device / Edge AI

**Category**: Frontier Models
**Maturity**: Emerging
**Relevance**: Medium
**Last Updated**: 2026-02-09

## What It Is

AI models that run directly on local hardware (laptops, phones, tablets, edge servers) without requiring cloud API calls. This includes small language models (1-14B parameters) optimized for local execution, on-device inference engines, and hardware-accelerated AI processing. Industry analysts predict 80% of AI inference will happen locally by late 2026, driven by privacy requirements, latency needs, and cost reduction.

## Why It Matters

Edge AI addresses the two biggest objections in government AI procurement: "our data cannot leave our network" and "what happens when the internet goes down?" Running models locally means zero data exfiltration risk and zero cloud dependency. For field operations (inspections, emergency response, rural offices with poor connectivity), edge AI is the only viable option. This is a growing niche in government contracting.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Llama 3.2 (1B, 3B) | Mobile-optimized model | Free (open weights) | Designed for on-device. Runs on phones and tablets. Text and vision variants. |
| Gemma 3 (2B, 9B) | Efficient model | Free (open weights) | Google's efficient model family. Strong for size. 2B runs on modest hardware. |
| Phi-4 (14B) | Small but capable | Free (open weights) | Microsoft's efficiency champion. 14B parameters with near-70B performance on many tasks. |
| Ollama | Local model runner | Free (open source) | One-command model download and serving. GPU and CPU support. REST API. |
| llama.cpp | Inference engine | Free (open source) | C/C++ inference. Runs quantized models on CPU. Optimized for Apple Silicon and x86. |
| Apple MLX | Apple Silicon framework | Free (open source) | Optimized for M-series chips. Near-native performance on Mac hardware. |
| ONNX Runtime | Cross-platform inference | Free (open source) | Microsoft's inference runtime. CPU, GPU, NPU support. Windows/Linux/Mac. |
| MediaPipe (Google) | On-device ML | Free (open source) | Pre-built ML pipelines for mobile. Object detection, pose estimation, text classification. |

## How It Fits Your Workflow

- **Kanban 1 (Demo Dev)**: Build edge AI demos for agencies with air-gapped environments. "This runs on a standard government laptop. No cloud required." Deploy Phi-4 via Ollama on a t3.small for live demo.
- **Proposals**: Include edge deployment as an option in technical approaches. "For sensitive data: on-premise model, no data leaves your network. For general use: cloud API with encryption." This addresses procurement concerns proactively.
- **Field Operations Use Cases**: Inspection apps (photo analysis on tablet), emergency response (triage assistant offline), rural office tools (document processing without broadband).
- **Cost Optimization**: High-volume, low-complexity tasks (classification, extraction, summarization) can run on local models at zero marginal cost after hardware investment.

## Current State of the Art

Phi-4 (14B parameters) achieves performance competitive with GPT-3.5 on many benchmarks while running on a MacBook Pro or a modest GPU server. For classification, extraction, and simple generation tasks, it is sufficient for production use.

Quantization has made larger models viable on smaller hardware. A Llama 4 8B model quantized to 4-bit (Q4_K_M format) requires only 5GB RAM and runs at 20-30 tokens/second on a modern laptop CPU. Quality loss from quantization is typically 3-8%.

Apple's M-series chips with unified memory are the best local inference hardware for small deployments. An M4 Mac Mini ($800) runs a 14B parameter model at 40+ tokens/second, making it a viable edge server for small office deployments.

NPU (Neural Processing Unit) acceleration is available in latest Intel, AMD, and Qualcomm laptop chips but software support is still immature. By late 2026, NPU-accelerated inference should be standard on government-issued laptops.

The practical capability boundary: models under 7B handle classification, extraction, and simple Q&A well. Models 7-14B handle summarization, basic reasoning, and conversational tasks. Models 30B+ approach cloud model quality but require dedicated GPU hardware. For most government edge use cases, 7-14B models suffice.

## Learning Path

1. **Run Phi-4 and Llama 3.2 locally via Ollama** - `ollama run phi4` and `ollama run llama3.2`. Test on government-relevant tasks (document classification, requirement extraction). Measure quality vs. cloud models.
2. **Build an offline document assistant** - Ollama + a simple web UI that runs entirely on a laptop. Process government forms without any network connection. This is a reusable demo component.
3. **Benchmark on government hardware specs** - Test model performance on hardware typical of government deployments (4-8 year old desktops, standard-issue laptops). Understand the real-world performance constraints.

## Notes

