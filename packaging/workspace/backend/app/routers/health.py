from fastapi import APIRouter
from ..db.connection import check_db
from ..config import settings

router = APIRouter()


@router.get("/health")
async def health():
    db_ok = await check_db()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "error",
        "model": settings.model_name,
    }
