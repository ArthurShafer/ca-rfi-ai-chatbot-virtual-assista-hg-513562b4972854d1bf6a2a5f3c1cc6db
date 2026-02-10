"""RAG service: embed queries, search pgvector, assemble context."""

import logging
import uuid as _uuid
from typing import Optional

from ..config import settings
from ..db.connection import get_pool


def _to_uuid(val):
    if val is None:
        return None
    if isinstance(val, _uuid.UUID):
        return val
    return _uuid.UUID(str(val))

logger = logging.getLogger(__name__)

# Load embedding model at module level (once)
_model = None


def _get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Loaded embedding model: all-MiniLM-L6-v2")
        except ImportError:
            logger.warning("sentence-transformers not available; RAG search disabled")
    return _model


def embed_text(text: str) -> Optional[list[float]]:
    """Generate embedding for a single text string."""
    model = _get_embedding_model()
    if model is None:
        return None
    embedding = model.encode([text])[0]
    return embedding.tolist()


async def search_similar(
    query_embedding: list[float],
    department_id: Optional[str] = None,
    top_k: int = 5,
) -> list[dict]:
    """Search content_chunks by cosine similarity."""
    pool = await get_pool()
    embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

    if department_id:
        sql = """
            SELECT id, title, content, source_url, department_id,
                   1 - (embedding <=> $1::vector) AS similarity
            FROM content_chunks
            WHERE embedding IS NOT NULL AND department_id = $2
            ORDER BY embedding <=> $1::vector
            LIMIT $3
        """
        async with pool.acquire() as conn:
            rows = await conn.fetch(sql, embedding_str, _to_uuid(department_id), top_k)
    else:
        sql = """
            SELECT id, title, content, source_url, department_id,
                   1 - (embedding <=> $1::vector) AS similarity
            FROM content_chunks
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> $1::vector
            LIMIT $2
        """
        async with pool.acquire() as conn:
            rows = await conn.fetch(sql, embedding_str, top_k)

    return [
        {
            "id": str(row["id"]),
            "title": row["title"],
            "content": row["content"],
            "source_url": row["source_url"],
            "similarity": float(row["similarity"]),
        }
        for row in rows
    ]


async def keyword_search(
    query: str,
    department_id: Optional[str] = None,
    top_k: int = 5,
) -> list[dict]:
    """Fallback: full-text keyword search for chunks without embeddings."""
    pool = await get_pool()
    words = [w.strip() for w in query.lower().split() if len(w.strip()) > 2]
    if not words:
        return []

    # Build ILIKE conditions for top keywords
    like_clauses = " OR ".join(["content ILIKE $" + str(i + 1) for i in range(len(words))])
    params = ["%" + w + "%" for w in words[:5]]

    if department_id:
        sql = f"""
            SELECT id, title, content, source_url, department_id
            FROM content_chunks
            WHERE ({like_clauses}) AND department_id = ${len(params) + 1}
            LIMIT ${len(params) + 2}
        """
        params.extend([_to_uuid(department_id), top_k])
    else:
        sql = f"""
            SELECT id, title, content, source_url, department_id
            FROM content_chunks
            WHERE ({like_clauses})
            LIMIT ${len(params) + 1}
        """
        params.append(top_k)

    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)

    return [
        {
            "id": str(row["id"]),
            "title": row["title"],
            "content": row["content"],
            "source_url": row["source_url"],
            "similarity": 0.5,
        }
        for row in rows
    ]


def assemble_context(chunks: list[dict]) -> str:
    """Format retrieved chunks into context string for the LLM."""
    if not chunks:
        return "No relevant information found in the knowledge base."

    parts = []
    for i, chunk in enumerate(chunks, 1):
        source = chunk.get("source_url", "Unknown")
        title = chunk.get("title", "")
        content = chunk["content"]
        parts.append(f"[Source {i}: {title}]\n{content}\n(URL: {source})")

    return "\n\n---\n\n".join(parts)
