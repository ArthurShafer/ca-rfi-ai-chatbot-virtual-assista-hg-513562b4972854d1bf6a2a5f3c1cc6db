# Vector Databases

**Category**: Architecture Patterns
**Maturity**: Growing
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

Specialized databases optimized for storing, indexing, and querying high-dimensional vector embeddings. Vectors are numerical representations of text, images, or other data produced by embedding models. Vector databases enable similarity search: "find documents most similar to this query." They are the storage and retrieval backbone of RAG systems, recommendation engines, and semantic search applications.

## Why It Matters

Every RAG system needs a vector store. The choice of vector database affects query latency, accuracy, cost, and operational complexity. For a solo operator, the right choice minimizes infrastructure burden. For government proposals, understanding the vector database landscape lets you recommend appropriate solutions: pgvector for agencies already on PostgreSQL, managed services for agencies without ML infrastructure, or open-source for agencies with data sovereignty requirements.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| pgvector | PostgreSQL extension | Free (open source) | Your primary tool. No new infrastructure. HNSW indexing, 30-80ms queries. Best for <10M vectors. |
| Pinecone | Managed vector DB | Free tier (100K vectors), $70/mo Starter | 30ms p99 latency. Serverless option. Most popular managed vector DB. |
| Weaviate | Open-source vector DB | Free (self-hosted), Cloud from $25/mo | 45ms p95 latency. Hybrid search built in. Strong filtering capabilities. |
| Qdrant | Open-source vector DB | Free (self-hosted), Cloud from $25/mo | 50ms p99 latency. Written in Rust, very fast. Good payload filtering. |
| Chroma | Embedded vector DB | Free (open source) | Runs in-process. Perfect for prototyping. Not for production scale. |
| Milvus | Open-source vector DB | Free (self-hosted), Zilliz Cloud managed | Handles billions of vectors. GPU-accelerated. Enterprise scale. |
| Amazon OpenSearch Serverless | Managed service | $0.24/OCU-hour + storage | Vector search in OpenSearch. AWS-native, integrates with Bedrock. |
| Supabase (pgvector) | Managed PostgreSQL | Free tier, $25/mo Pro | PostgreSQL with pgvector pre-installed. Good for projects already using Supabase. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: pgvector in your existing SQLite-to-PostgreSQL migration path. Store embeddings of solicitation descriptions for semantic search: "find opportunities similar to this one I liked."
- **Kanban 1 (Demo Dev)**: pgvector is the default for demos. Government agencies on PostgreSQL can adopt it without new infrastructure. For demos requiring higher scale, use Pinecone's free tier.
- **Proposals**: Recommend pgvector for agencies with existing PostgreSQL. Recommend Pinecone or OpenSearch Serverless for agencies wanting managed services. Recommend Qdrant/Weaviate for agencies with data sovereignty concerns.
- **Architecture Decisions**: pgvector for development and small-medium production. Dedicated vector DB for >10M vectors or sub-10ms latency requirements.

## Current State of the Art

pgvector 0.7+ with HNSW indexing has closed much of the performance gap with dedicated vector databases. For collections under 10 million vectors, pgvector delivers 30-80ms query latency, which is adequate for most government applications. The key advantage: zero additional infrastructure for PostgreSQL shops.

Pinecone's serverless architecture (launched late 2024, matured through 2025) reduced costs by 50-80% compared to their pod-based offering. Queries start at $0.00002 per query, making it viable for even low-traffic applications.

Hybrid search (combining vector similarity with keyword matching and metadata filtering) is now table stakes. All major vector databases support it. The accuracy improvement over pure vector search is 10-15%, making it the default recommendation.

The trend toward "vector search as a feature" rather than "vector database as a product" is accelerating. PostgreSQL, Redis, MongoDB, and Elasticsearch all now have vector search capabilities. This commoditization benefits users but threatens standalone vector database companies.

Embedding model choice matters more than database choice for query quality. Moving from older embeddings (ada-002) to current models (text-embedding-3-large, Cohere embed-v3) improves retrieval accuracy by 20-30%, regardless of which vector database you use.

## Learning Path

1. **Add pgvector to your PostgreSQL setup** - `CREATE EXTENSION vector;` and you're started. Index your solicitation descriptions as vectors. Anthropic's cookbook has a pgvector tutorial.
2. **Benchmark your use case** - Test the same 1,000 queries against pgvector, Pinecone (free tier), and Qdrant (Docker). Measure latency, accuracy, and setup time. The results inform your standard recommendation.
3. **Study embedding models** - Compare text-embedding-3-large, Cohere embed-v3, and Voyage AI on your government documents. Embedding quality matters more than database choice.

## Notes

