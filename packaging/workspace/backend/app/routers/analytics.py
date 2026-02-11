"""Analytics endpoints for the admin dashboard."""

from fastapi import APIRouter, Header, HTTPException, Query

from ..config import settings
from ..db.connection import get_pool

router = APIRouter(prefix="/api/analytics")


def _verify_admin(password: str | None):
    if password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Invalid admin password")


@router.get("/overview")
async def overview(
    days: int = Query(default=7, ge=1, le=90),
    x_admin_password: str | None = Header(default=None),
):
    _verify_admin(x_admin_password)
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT
                COUNT(DISTINCT c.id) AS total_conversations,
                COUNT(m.id) AS total_messages,
                AVG(m.response_time_ms) FILTER (WHERE m.role = 'assistant') AS avg_response_time_ms,
                AVG(c.satisfaction_rating) FILTER (WHERE c.satisfaction_rating IS NOT NULL) AS avg_satisfaction
            FROM conversations c
            LEFT JOIN messages m ON m.conversation_id = c.id
            WHERE c.started_at >= now() - ($1 || ' days')::interval
            """,
            str(days),
        )
    return {
        "total_conversations": row["total_conversations"] or 0,
        "total_messages": row["total_messages"] or 0,
        "avg_response_time_ms": round(row["avg_response_time_ms"] or 0, 0),
        "avg_satisfaction": round(row["avg_satisfaction"] or 0, 1) if row["avg_satisfaction"] else None,
        "period_days": days,
    }


@router.get("/departments")
async def departments(
    days: int = Query(default=7, ge=1, le=90),
    x_admin_password: str | None = Header(default=None),
):
    _verify_admin(x_admin_password)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT d.slug, d.name, COUNT(c.id) AS count
            FROM departments d
            LEFT JOIN conversations c ON c.department_id = d.id
                AND c.started_at >= now() - ($1 || ' days')::interval
            GROUP BY d.slug, d.name
            ORDER BY count DESC
            """,
            str(days),
        )
    return {
        "departments": [
            {"slug": r["slug"], "name": r["name"], "count": r["count"]}
            for r in rows
        ],
        "period_days": days,
    }


@router.get("/languages")
async def languages(
    days: int = Query(default=7, ge=1, le=90),
    x_admin_password: str | None = Header(default=None),
):
    _verify_admin(x_admin_password)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT language, COUNT(*) AS count
            FROM conversations
            WHERE started_at >= now() - ($1 || ' days')::interval
            GROUP BY language
            ORDER BY count DESC
            """,
            str(days),
        )
    labels = {"en": "English", "es": "Spanish"}
    return {
        "languages": [
            {
                "language": r["language"],
                "label": labels.get(r["language"], r["language"]),
                "count": r["count"],
            }
            for r in rows
        ],
        "period_days": days,
    }


@router.get("/top-questions")
async def top_questions(
    days: int = Query(default=7, ge=1, le=90),
    limit: int = Query(default=10, ge=1, le=50),
    x_admin_password: str | None = Header(default=None),
):
    _verify_admin(x_admin_password)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT LOWER(TRIM(content)) AS message, COUNT(*) AS count
            FROM messages
            WHERE role = 'user'
              AND created_at >= now() - ($1 || ' days')::interval
            GROUP BY LOWER(TRIM(content))
            ORDER BY count DESC
            LIMIT $2
            """,
            str(days),
            limit,
        )
    return {
        "questions": [{"message": r["message"], "count": r["count"]} for r in rows],
        "period_days": days,
    }


@router.get("/conversations")
async def recent_conversations(
    limit: int = Query(default=20, ge=1, le=100),
    x_admin_password: str | None = Header(default=None),
):
    _verify_admin(x_admin_password)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT c.id, c.language, d.name AS department, c.started_at,
                   c.message_count, c.satisfaction_rating,
                   (SELECT content FROM messages WHERE conversation_id = c.id AND role = 'user' ORDER BY created_at LIMIT 1) AS first_message
            FROM conversations c
            LEFT JOIN departments d ON d.id = c.department_id
            ORDER BY c.started_at DESC
            LIMIT $1
            """,
            limit,
        )
    return {
        "conversations": [
            {
                "id": str(r["id"]),
                "language": r["language"],
                "department": r["department"],
                "started_at": r["started_at"].isoformat() if r["started_at"] else None,
                "message_count": r["message_count"],
                "first_message": r["first_message"],
                "satisfaction_rating": r["satisfaction_rating"],
            }
            for r in rows
        ]
    }
