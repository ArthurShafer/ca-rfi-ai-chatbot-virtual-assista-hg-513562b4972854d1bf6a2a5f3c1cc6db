# Implementation Prompt: FastAPI Backend Core

## Metadata
- **Order**: 3
- **Dependencies**: 01-database-schema, 02-content-scraper (needs data to retrieve)
- **Skills**: fastapi-templates, api-design-principles
- **Scope**: Medium
- **Estimated Tokens**: ~120K

## Context
Database is populated with department data and content chunks with embeddings. We need the API layer that receives chat messages, retrieves relevant context via pgvector, calls Claude, and streams responses back.

## Objective
Build the FastAPI backend application with chat endpoint, RAG retrieval, Claude Haiku 4.5 integration, health check, and CORS configuration.

## Requirements
- FastAPI app at `backend/app/main.py`
- Project structure:
  ```
  backend/
    app/
      main.py          # FastAPI app, CORS, lifespan
      config.py        # Settings from env vars (pydantic-settings)
      routers/
        chat.py        # POST /api/chat (streaming)
        health.py      # GET /health
      services/
        rag.py         # Vector search + context assembly
        llm.py         # Claude API wrapper
      models/
        schemas.py     # Pydantic request/response models
      db/
        connection.py  # Async database pool
    requirements.txt
    Dockerfile
  ```
- `POST /api/chat` endpoint:
  - Accepts: `{ message: string, conversation_id?: string, language: "en"|"es" }`
  - Creates conversation if conversation_id not provided
  - Embeds the user message with sentence-transformers
  - Queries pgvector for top 5 similar chunks (filtered by department if routing is active)
  - Calls Claude Haiku 4.5 with system prompt + retrieved context + user message
  - Streams response via Server-Sent Events (SSE)
  - Logs message to messages table with tokens_used and response_time_ms
  - Returns: SSE stream with `{ conversation_id, department, content_chunk }`
- `GET /health` endpoint:
  - Returns `{ status: "ok", database: "connected"|"error", model: "claude-haiku-4.5" }`
  - Tests database connectivity
- CORS: Allow Vercel frontend origins + localhost:3000
- System prompt from design doc section 4 (RAG Pipeline)
- Anthropic SDK for Claude calls with streaming
- asyncpg for async database operations
- Error handling: API down → 503, Claude fails → fallback message with department contact info, bad input → 422 validation

## Acceptance Criteria
- `uvicorn backend.app.main:app` starts without errors
- GET /health returns 200 with database status
- POST /api/chat accepts a message and streams a response grounded in county content
- Response includes conversation_id for follow-up messages
- Messages are logged to the database
- CORS allows requests from localhost:3000 and Vercel domains
- Dockerfile builds and runs the backend

## Technical Notes
- Use `anthropic` Python SDK with `client.messages.stream()` for SSE
- Embedding at query time: load sentence-transformers model once at startup (app lifespan), reuse for all queries
- Connection pool: use asyncpg with pool_size=5 (Supabase free tier allows 20 connections)
- System prompt should include the SB 313 disclosure instruction: tell the model to remind users it's an AI if they seem confused
- Rate limit: No rate limiting needed for demo traffic
