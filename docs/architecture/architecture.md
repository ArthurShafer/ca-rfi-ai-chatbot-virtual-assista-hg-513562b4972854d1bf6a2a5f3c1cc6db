# Tulare County AI Chatbot — Architecture

## System Overview

A bilingual (English/Spanish) AI chatbot that helps Tulare County residents find information about county services. The chatbot uses RAG (Retrieval-Augmented Generation) over scraped county website content to provide accurate, grounded answers. It routes conversations to the appropriate department, discloses its AI nature per California SB 313, and meets WCAG 2.1 AA accessibility standards.

The system is a three-tier web application: Next.js frontend on Vercel, FastAPI backend on Render, PostgreSQL with pgvector on Supabase. All free-tier hosting. Claude Haiku 4.5 powers the conversational AI at ~$0.01 per conversation.

Built as a teaming partner demo asset — showcases full-stack AI engineering capability.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | SSR, streaming, Vercel deployment |
| Styling | Tailwind CSS | Rapid UI, gov-appropriate design |
| Chat streaming | Vercel AI SDK | useChat hook, SSE streaming |
| Backend | FastAPI (Python) | Async, fast, great for AI/ML workloads |
| LLM | Claude Haiku 4.5 (Anthropic) | Fast, cheap, Constitutional AI safety |
| Embeddings | all-MiniLM-L6-v2 (sentence-transformers) | Free, local, no API dependency |
| Database | PostgreSQL 16 + pgvector | Vector search + relational in one DB |
| Hosting (FE) | Vercel (free tier) | Zero-config Next.js deployment |
| Hosting (BE) | Render (free tier) | Easy Python deployment |
| Hosting (DB) | Supabase (free tier) | Managed Postgres with pgvector |
| Local dev | Docker Compose | One-command full stack |

## Component Diagram

```
User (Browser)
    │
    ▼
┌──────────────────────────────────┐
│  Next.js Frontend (Vercel)       │
│  ┌────────────┐ ┌─────────────┐  │
│  │ ChatWidget  │ │ AdminPanel  │  │
│  │ (floating)  │ │ (/admin)    │  │
│  └──────┬─────┘ └──────┬──────┘  │
│         │               │         │
│  ┌──────▼───────────────▼──────┐  │
│  │   /api/chat (proxy route)   │  │
│  │   /api/analytics (proxy)    │  │
│  └──────────────┬──────────────┘  │
└─────────────────┼────────────────┘
                  │ HTTPS
┌─────────────────▼────────────────┐
│  FastAPI Backend (Render)        │
│  ┌──────────┐ ┌───────────────┐  │
│  │ /api/chat │ │ /api/analytics│  │
│  └────┬─────┘ └───────┬───────┘  │
│       │               │          │
│  ┌────▼────┐  ┌───────▼───────┐  │
│  │ Routing  │  │  Analytics    │  │
│  │ Service  │  │  Queries      │  │
│  └────┬────┘  └───────────────┘  │
│       │                          │
│  ┌────▼────────────────────────┐ │
│  │ RAG Service                 │ │
│  │ embed query → pgvector      │ │
│  │ search → assemble context   │ │
│  └────┬────────────────────────┘ │
│       │                          │
│  ┌────▼────────────────────────┐ │
│  │ LLM Service                 │ │
│  │ system prompt + context     │ │
│  │ → Claude Haiku 4.5          │ │
│  │ → stream response           │ │
│  └─────────────────────────────┘ │
└─────────────────┬────────────────┘
                  │
┌─────────────────▼────────────────┐
│  PostgreSQL + pgvector (Supabase)│
│  ┌──────────┐ ┌───────────────┐  │
│  │departments│ │content_chunks │  │
│  └──────────┘ │(+ embeddings) │  │
│               └───────────────┘  │
│  ┌──────────────┐ ┌──────────┐   │
│  │conversations  │ │messages  │   │
│  └──────────────┘ └──────────┘   │
│  ┌──────────────┐                │
│  │analytics_daily│                │
│  └──────────────┘                │
└──────────────────────────────────┘
```

## API Overview

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/chat | Send message, receive streaming response | None (public) |
| GET | /health | Service health + DB connectivity | None |
| GET | /api/analytics/overview | Aggregate stats (conversations, messages, response time) | Admin password |
| GET | /api/analytics/departments | Conversation counts by department | Admin password |
| GET | /api/analytics/languages | Conversation counts by language | Admin password |
| GET | /api/analytics/top-questions | Most frequent user messages | Admin password |
| GET | /api/analytics/conversations | Recent conversation list with previews | Admin password |

## Data Flow: Chat Message

1. User types message in ChatWidget
2. Frontend sends POST to /api/chat (Next.js proxy → FastAPI)
3. Backend determines department (keyword match or LLM classification)
4. Backend embeds user message with sentence-transformers
5. Backend queries pgvector for top 5 similar content chunks (filtered by department)
6. Backend constructs system prompt + context + user message
7. Backend calls Claude Haiku 4.5 with streaming
8. Backend streams SSE response to frontend
9. Frontend renders tokens as they arrive (Vercel AI SDK)
10. Backend logs conversation and message to database

## Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Separate frontend/backend | Yes | Teaming pitch: "you build the UI, we provide the API" |
| Claude Haiku over Sonnet | Haiku 4.5 | 10x cheaper, fast enough with RAG grounding |
| Local embeddings | all-MiniLM-L6-v2 | Free, no API key needed, 384 dims |
| pgvector over dedicated vector DB | pgvector | One database for everything, Supabase built-in |
| Keyword routing before LLM | Yes | Saves an LLM call for obvious cases |
| No live agent integration | Correct | Demo scope — show the handoff path, not the integration |
| Admin dashboard password only | Correct | Demo security — not production auth |

## Configuration

| Variable | Purpose | Default | Required |
|----------|---------|---------|----------|
| ANTHROPIC_API_KEY | Claude API access | — | Yes |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:localdev@db:5432/tulare_chatbot | Yes |
| ADMIN_PASSWORD | Analytics dashboard access | demo-admin | No |
| NEXT_PUBLIC_API_URL | Backend URL for frontend | http://localhost:8000 | No |
| NEXT_PUBLIC_BASE_PATH | URL base path | /tulare-chatbot | No |
