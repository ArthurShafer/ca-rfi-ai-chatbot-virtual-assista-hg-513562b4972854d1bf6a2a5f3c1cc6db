# RAG (Retrieval-Augmented Generation)

**Category**: Architecture Patterns
**Maturity**: Growing
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

RAG combines large language models with external knowledge retrieval to generate responses grounded in specific, up-to-date data. Instead of relying solely on a model's training data, RAG systems first search a knowledge base (documents, databases, APIs) for relevant context, then pass that context to the LLM alongside the user's question. This dramatically reduces hallucinations and enables domain-specific accuracy.

## Why It Matters

RAG is the single most requested AI capability in government RFPs. Every state agency has mountains of documents (policies, regulations, historical records) that employees struggle to search. RAG turns these document stores into conversational knowledge bases. For government contracting, RAG is both a product to sell and a tool to use: internally for analyzing solicitations and externally as a demo capability for nearly any agency.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| pgvector | Vector extension for PostgreSQL | Free (open source) | Your entry point. Add vector search to existing Postgres. No new infrastructure needed. |
| LangChain | RAG framework | Free (open source) | Most popular RAG framework. Document loaders, text splitters, retrieval chains. Python and JS. |
| LlamaIndex | RAG framework | Free (open source) | Focused specifically on RAG. Better document parsing than LangChain. Strong indexing strategies. |
| Amazon Bedrock Knowledge Bases | Managed RAG | ~$0.01/query + storage | Fully managed RAG on AWS. S3 document ingestion, vector search, Claude integration. |
| Vercel AI SDK | Frontend RAG | Free (open source) | Streaming RAG responses in Next.js. Good for demo UIs. |
| Unstructured.io | Document processing | Free (open source), hosted plans | Converts PDFs, Word docs, HTML into RAG-ready chunks. Handles messy government documents. |
| Chroma | Vector database | Free (open source) | Lightweight, embedded vector DB. Good for prototyping. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: RAG over solicitation documents. Upload an RFP, ask questions about requirements, compliance needs, and evaluation criteria without reading 200 pages.
- **Kanban 1 (Demo Dev)**: RAG is the most common demo to build for government clients. "Upload your policy documents, ask questions in natural language." Can be built in 2-3 days with pgvector + LangChain.
- **Kanban 2 (Teaming)**: "We build RAG systems for state agencies" is a powerful teaming pitch. Partners bring domain expertise (healthcare, transportation), you bring the RAG platform.
- **Proposals**: Every technical approach for document-heavy agencies should include RAG. Cite specific metrics: 90% reduction in document search time, grounded answers with source citations.

## Current State of the Art

Production RAG in early 2026 achieves 85-95% accuracy on well-structured document collections when properly implemented. The key factors are chunking strategy (semantic chunking outperforms fixed-size by 15-20%), embedding model selection (OpenAI text-embedding-3-large and Cohere embed-v3 lead), and retrieval strategy (hybrid keyword + vector search beats pure vector by 10-15%).

pgvector has matured significantly: it now supports HNSW indexing with sub-100ms query times for collections up to 10 million vectors, making it viable for production government deployments without dedicated vector database infrastructure.

Amazon Bedrock Knowledge Bases provides the easiest path to production RAG on AWS: point it at an S3 bucket of documents, it handles chunking, embedding, indexing, and retrieval. Good for demos and proof-of-concepts, but less configurable than custom implementations.

The remaining challenges are: multi-modal documents (tables, charts, forms), very long documents (100+ pages), and maintaining freshness when source documents change frequently.

## Learning Path

1. **Build a pgvector RAG demo** - Add pgvector to your existing PostgreSQL setup. Ingest 50 government documents. Build a simple query interface. This is both learning and a reusable demo asset.
2. **Study chunking strategies** - Read LlamaIndex's documentation on node parsers. Experiment with sentence-window, auto-merging, and semantic chunking on real RFP documents.
3. **Explore Bedrock Knowledge Bases** - Build the same demo using AWS managed services. Compare quality, cost, and setup time with your custom implementation.

## Notes

