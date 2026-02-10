# Tulare County AI Chatbot — API Specification

## Base URL

- **Local**: `http://localhost:8000`
- **Production**: `https://tulare-chatbot-api.onrender.com`

## Authentication

- **Chat endpoints**: No authentication (public-facing)
- **Analytics endpoints**: `X-Admin-Password` header must match `ADMIN_PASSWORD` env var
- **Health endpoint**: No authentication

---

## Endpoints

### Health

#### GET /health

Returns service health status and connectivity.

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected",
  "model": "claude-haiku-4.5"
}
```

**Response (503 — database unreachable):**
```json
{
  "status": "degraded",
  "database": "error",
  "model": "claude-haiku-4.5"
}
```

---

### Chat

#### POST /api/chat

Send a user message and receive a streaming AI response via Server-Sent Events.

**Request:**
```json
{
  "message": "How do I apply for CalFresh?",
  "conversation_id": "uuid-or-null",
  "language": "en"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | User's message text |
| conversation_id | string (UUID) | No | Existing conversation ID. If null, creates new conversation. |
| language | string | No | "en" or "es". Default: "en" |

**Response (200 — SSE stream):**

The response is a Server-Sent Events stream compatible with Vercel AI SDK's `useChat` hook. Each event contains a text chunk of the assistant's response.

```
data: {"conversation_id": "abc-123", "department": {"slug": "hhsa", "name": "Health & Human Services", "name_es": "Salud y Servicios Humanos"}}

data: {"text": "To apply for"}
data: {"text": " CalFresh benefits"}
data: {"text": " in Tulare County,"}
data: {"text": " you can..."}
data: [DONE]
```

The first SSE event contains metadata (conversation_id, detected department). Subsequent events contain text chunks. Stream ends with `[DONE]`.

**Error Responses:**

| Status | Meaning | Body |
|--------|---------|------|
| 422 | Validation error | `{"detail": "message field is required"}` |
| 500 | Claude API error | `{"detail": "AI service temporarily unavailable"}` |
| 503 | Database error | `{"detail": "Service temporarily unavailable"}` |

---

### Analytics

All analytics endpoints require the `X-Admin-Password` header.

**Error Response (401):**
```json
{"detail": "Invalid admin password"}
```

#### GET /api/analytics/overview

Aggregate conversation statistics.

**Query params:**
- `days` (int, default: 7) — lookback period

**Response (200):**
```json
{
  "total_conversations": 156,
  "total_messages": 892,
  "avg_response_time_ms": 1250,
  "avg_satisfaction": 4.2,
  "period_days": 7
}
```

#### GET /api/analytics/departments

Conversation counts by department.

**Query params:**
- `days` (int, default: 7)

**Response (200):**
```json
{
  "departments": [
    {"slug": "hhsa", "name": "Health & Human Services", "count": 45},
    {"slug": "rma", "name": "Resource Management Agency", "count": 23},
    {"slug": "clerk", "name": "Assessor/Clerk-Recorder", "count": 18},
    {"slug": "general", "name": "General", "count": 15}
  ],
  "period_days": 7
}
```

#### GET /api/analytics/languages

Conversation counts by language.

**Query params:**
- `days` (int, default: 7)

**Response (200):**
```json
{
  "languages": [
    {"language": "en", "label": "English", "count": 120},
    {"language": "es", "label": "Spanish", "count": 36}
  ],
  "period_days": 7
}
```

#### GET /api/analytics/top-questions

Most frequently asked user messages.

**Query params:**
- `days` (int, default: 7)
- `limit` (int, default: 10)

**Response (200):**
```json
{
  "questions": [
    {"message": "How do I apply for CalFresh?", "count": 12},
    {"message": "What do I need for a building permit?", "count": 8},
    {"message": "Where is the animal shelter?", "count": 6}
  ],
  "period_days": 7
}
```

#### GET /api/analytics/conversations

Recent conversations with message previews.

**Query params:**
- `limit` (int, default: 20)

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "abc-123",
      "language": "en",
      "department": "HHSA",
      "started_at": "2026-02-10T14:30:00Z",
      "message_count": 5,
      "first_message": "How do I apply for CalFresh?",
      "satisfaction_rating": 4
    }
  ]
}
```
