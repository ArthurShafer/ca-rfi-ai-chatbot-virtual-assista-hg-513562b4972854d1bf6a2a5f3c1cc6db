"""Chat endpoint with streaming SSE response."""

import json
import logging
import time
import uuid

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..db.connection import get_pool
from ..models.schemas import ChatRequest
from ..services.llm import stream_response
from ..services.rag import assemble_context, embed_text, keyword_search, search_similar
from ..services.routing import detect_department, update_conversation_department

logger = logging.getLogger(__name__)
router = APIRouter()


def _to_uuid(val):
    """Convert string to UUID if needed."""
    if val is None:
        return None
    if isinstance(val, uuid.UUID):
        return val
    return uuid.UUID(str(val))


async def _get_or_create_conversation(
    conversation_id: str | None, language: str
) -> tuple[str, str | None]:
    """Get existing conversation or create a new one."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        if conversation_id:
            try:
                cid = _to_uuid(conversation_id)
                row = await conn.fetchrow(
                    "SELECT id, department_id FROM conversations WHERE id = $1",
                    cid,
                )
                if row:
                    return str(row["id"]), str(row["department_id"]) if row["department_id"] else None
            except (ValueError, AttributeError):
                pass

        # Create new conversation
        new_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO conversations (id, language) VALUES ($1, $2)",
            new_id,
            language,
        )
        return str(new_id), None


async def _get_conversation_history(conversation_id: str) -> list[dict]:
    """Get recent messages for conversation context."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """SELECT role, content FROM messages
               WHERE conversation_id = $1
               ORDER BY created_at DESC LIMIT 6""",
            _to_uuid(conversation_id),
        )
    return [{"role": row["role"], "content": row["content"]} for row in reversed(rows)]


async def _log_message(
    conversation_id: str,
    role: str,
    content: str,
    department_id: str | None,
    tokens_used: int | None = None,
    response_time_ms: int | None = None,
):
    """Log a message to the database."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO messages (conversation_id, role, content, department_id, tokens_used, response_time_ms)
               VALUES ($1, $2, $3, $4, $5, $6)""",
            _to_uuid(conversation_id),
            role,
            content,
            _to_uuid(department_id),
            tokens_used,
            response_time_ms,
        )
        await conn.execute(
            "UPDATE conversations SET message_count = message_count + 1 WHERE id = $1",
            _to_uuid(conversation_id),
        )


@router.post("/api/chat")
async def chat(request: ChatRequest):
    start_time = time.time()

    # Get or create conversation
    conversation_id, current_dept_id = await _get_or_create_conversation(
        request.conversation_id, request.language
    )

    # Detect department
    department = await detect_department(
        request.message, current_dept_id
    )
    dept_id = str(department["id"])

    # Update conversation department
    await update_conversation_department(conversation_id, dept_id)

    # Log user message
    await _log_message(conversation_id, "user", request.message, dept_id)

    # RAG: embed query and search, with keyword fallback
    query_embedding = embed_text(request.message)
    if query_embedding:
        chunks = await search_similar(query_embedding, department_id=dept_id)
    else:
        chunks = []

    # Fallback to keyword search if no embedding results
    if not chunks:
        chunks = await keyword_search(request.message, department_id=dept_id)

    context = assemble_context(chunks)

    # Get conversation history
    history = await _get_conversation_history(conversation_id)

    # Stream response
    async def generate():
        # First event: metadata
        meta = {
            "conversation_id": conversation_id,
            "department": {
                "slug": department["slug"],
                "name": department["name"],
                "name_es": department["name_es"],
            },
        }
        yield f"data: {json.dumps(meta)}\n\n"

        # Stream text chunks
        full_response = ""
        async for text_chunk in stream_response(
            message=request.message,
            context=context,
            language=request.language,
            department=department["name"],
            conversation_history=history,
        ):
            full_response += text_chunk
            yield f"data: {json.dumps({'text': text_chunk})}\n\n"

        # Done signal
        yield "data: [DONE]\n\n"

        # Log assistant message
        elapsed_ms = int((time.time() - start_time) * 1000)
        await _log_message(
            conversation_id,
            "assistant",
            full_response,
            dept_id,
            response_time_ms=elapsed_ms,
        )

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
