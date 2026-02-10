"""Department routing: keyword matching + LLM fallback."""

import logging
import uuid as _uuid
from typing import Optional

from ..db.connection import get_pool


def _to_uuid(val):
    """Convert string to UUID if needed."""
    if val is None:
        return None
    if isinstance(val, _uuid.UUID):
        return val
    return _uuid.UUID(str(val))

logger = logging.getLogger(__name__)

# Loaded at startup
_department_cache: list[dict] = []


async def load_departments():
    """Load departments into memory cache."""
    global _department_cache
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, name, name_es, slug, keywords, phone, email, url FROM departments"
        )
    _department_cache = [dict(row) for row in rows]
    logger.info("Loaded %d departments into routing cache", len(_department_cache))


def get_departments() -> list[dict]:
    return _department_cache


def get_department_by_slug(slug: str) -> Optional[dict]:
    for dept in _department_cache:
        if dept["slug"] == slug:
            return dept
    return None


def keyword_match(message: str) -> Optional[dict]:
    """Match user message against department keywords. Returns best match or None."""
    message_lower = message.lower()
    matches = []

    for dept in _department_cache:
        if dept["slug"] == "general":
            continue  # Don't match on general keywords
        keywords = dept.get("keywords") or []
        score = sum(1 for kw in keywords if kw.lower() in message_lower)
        if score > 0:
            matches.append((dept, score))

    if not matches:
        return None

    # Return highest scoring department
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches[0][0]


async def detect_department(
    message: str,
    current_department_id: Optional[str] = None,
) -> dict:
    """Detect department from message. Uses keyword matching first, then falls back to general."""
    matched = keyword_match(message)

    if matched:
        return matched

    # If already routed to a department, stay there (sticky routing)
    if current_department_id:
        for dept in _department_cache:
            if str(dept["id"]) == current_department_id:
                return dept

    # Default to general
    return get_department_by_slug("general") or _department_cache[0]


async def update_conversation_department(conversation_id: str, department_id: str):
    """Update the department on a conversation record."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE conversations SET department_id = $1 WHERE id = $2",
            _to_uuid(department_id),
            _to_uuid(conversation_id),
        )
