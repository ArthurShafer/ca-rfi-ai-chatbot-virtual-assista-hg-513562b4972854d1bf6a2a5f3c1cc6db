from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = None
    language: str = Field(default="en", pattern="^(en|es)$")


class DepartmentInfo(BaseModel):
    slug: str
    name: str
    name_es: str


class HealthResponse(BaseModel):
    status: str
    database: str
    model: str


class AnalyticsOverview(BaseModel):
    total_conversations: int
    total_messages: int
    avg_response_time_ms: Optional[float]
    avg_satisfaction: Optional[float]
    period_days: int
