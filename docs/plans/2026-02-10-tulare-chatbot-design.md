# Design: Tulare County AI Chatbot & Virtual Assistant Demo

> **Date**: 2026-02-10
> **Campaign**: HG-513562b4972854d1bf6a2a5f3c1cc6db
> **Purpose**: Working demo for teaming partner outreach
> **Target audience**: Local/regional CA IT firms who need an AI subcontractor

---

## 1. Architecture Overview

Three-tier architecture deployed on free-tier services:

```
┌─────────────────────────────────────┐
│         Vercel (Free Tier)          │
│      Next.js 14 App Router         │
│   Tailwind CSS + Bilingual UI      │
│      Chat Widget + Admin Panel     │
└──────────────┬──────────────────────┘
               │ HTTPS
┌──────────────▼──────────────────────┐
│        Render (Free Tier)           │
│          FastAPI Backend            │
│   Claude Haiku 4.5 (Anthropic SDK) │
│     RAG retrieval + routing         │
│       Guardrails + logging          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Supabase (Free Tier)          │
│    PostgreSQL + pgvector            │
│  Scraped county content (vectors)   │
│  Conversation logs + analytics      │
└─────────────────────────────────────┘
```

### Key decisions

- **Next.js on Vercel** — SSR, streaming via Vercel AI SDK, professional URL
- **FastAPI on Render** — Clean REST API separable from frontend. The teaming pitch: "you build the UI, we provide the AI API"
- **Supabase PostgreSQL** — pgvector built in, 500MB free tier, managed
- **Claude Haiku 4.5** — Fast (~200ms), cheap ($0.01/conversation), upgradeable to Sonnet via config change
- **Docker Compose ships alongside** — Partners can run locally with `docker compose up`

### Cost profile

| Component | Monthly Cost |
|-----------|-------------|
| Vercel free tier | $0 |
| Supabase free tier | $0 |
| Render free tier | $0 |
| Claude API (demo traffic) | ~$1-5 |
| **Total** | **~$1-5/month** |

---

## 2. Chat Experience & Compliance

### Citizen-facing chat interface

- **Floating widget** — Bottom-right corner, expandable to full panel
- **SB 313 AI disclosure** — Persistent banner: "You are chatting with an AI assistant. Need a person? Call (559) XXX-XXXX or click here." Always visible, never dismissable
- **Bilingual toggle** — EN/ES switch in chat header. Entire UI and all bot responses render in selected language. Claude handles Spanish natively (no translation API)
- **Department-aware routing** — Detects department from user intent, adjusts system prompt context, shows visual indicator ("Connecting you to Permits & Planning..."), retrieves department-specific RAG chunks
- **Suggested questions** — On first load, 4-5 clickable starters in user's language
- **Human escalation** — "Talk to a person" button always visible. Shows department phone/email. No live agent integration for demo.

### WCAG 2.1 AA compliance

- Full keyboard navigation (Tab through messages, Enter to send)
- `aria-live="polite"` for new bot messages
- 4.5:1 contrast ratios on all text
- Focus management on new messages
- Semantic HTML: chat as ordered list, not divs
- ARIA roles on all interactive elements

---

## 3. Data Model

### PostgreSQL Tables (Supabase)

```sql
-- Departments catalog
departments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  name_es TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_es TEXT,
  phone TEXT,
  email TEXT,
  url TEXT,
  keywords TEXT[],           -- for routing: ["permit", "building", "zoning"]
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Scraped content chunks with embeddings
content_chunks (
  id UUID PRIMARY KEY,
  department_id UUID REFERENCES departments(id),
  source_url TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  content_es TEXT,            -- Spanish translation (populated async)
  embedding VECTOR(384),      -- all-MiniLM-L6-v2 dimensions
  chunk_index INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Conversations
conversations (
  id UUID PRIMARY KEY,
  language TEXT DEFAULT 'en', -- 'en' or 'es'
  department_id UUID REFERENCES departments(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,
  satisfaction_rating INTEGER, -- 1-5, optional
  metadata JSONB
)

-- Individual messages
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT NOT NULL,          -- 'user' or 'assistant'
  content TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Analytics aggregates (materialized for dashboard)
analytics_daily (
  date DATE PRIMARY KEY,
  total_conversations INTEGER,
  total_messages INTEGER,
  avg_messages_per_conversation FLOAT,
  avg_response_time_ms FLOAT,
  conversations_by_department JSONB,
  conversations_by_language JSONB,
  top_questions JSONB,
  satisfaction_avg FLOAT
)
```

### Embedding model choice

**all-MiniLM-L6-v2** via sentence-transformers (free, 384 dimensions):
- Runs locally in the scraper pipeline — no API cost
- 384 dimensions keeps pgvector index small
- Good enough quality for FAQ-style county content retrieval
- Falls back to OpenAI text-embedding-3-small if local model fails

---

## 4. RAG Pipeline

### Content scraping

1. **Crawl tularecounty.ca.gov** — Start from department directory, follow internal links, max depth 3
2. **Crawl tchhsa.org** — HHSA benefits, public health, behavioral health pages
3. **Extract text** — Strip HTML, preserve headings and structure
4. **Chunk** — Semantic chunking by heading sections, ~500 tokens per chunk with 50-token overlap
5. **Classify** — Assign each chunk to a department based on source URL path
6. **Embed** — Generate vectors with all-MiniLM-L6-v2
7. **Store** — Load into content_chunks table with pgvector

### Retrieval at query time

1. User sends message → FastAPI receives it
2. Embed the user's message with same model
3. Query pgvector: cosine similarity search, top 5 chunks
4. If department already detected, filter by department_id
5. Pass retrieved chunks as context to Claude along with system prompt
6. Stream response back to frontend

### System prompt structure

```
You are Tulare County's AI assistant. You help residents find
information about county services.

RULES:
- Only answer from the provided context. If unsure, say so and
  provide the relevant department's phone number.
- Never make up information about county services, hours, or contacts.
- If the user speaks Spanish, respond in Spanish.
- Always be respectful and professional.
- For sensitive topics (legal, medical, financial), direct to
  the appropriate department rather than advising.

CONTEXT:
{retrieved_chunks}

DEPARTMENT: {detected_department or "General"}
LANGUAGE: {en or es}
```

---

## 5. Department Routing

### How it works

1. **Keyword matching (fast path)** — Check user message against department keyword arrays. "building permit" → Resource Management Agency.
2. **LLM classification (fallback)** — If no keyword match, ask Claude to classify the intent into one of the known departments. Single function call, fast.
3. **Sticky routing** — Once a department is detected in a conversation, subsequent messages default to that department unless the user explicitly changes topic.
4. **Visual feedback** — Chat header updates to show current department. Color-coded badges.

### Departments to seed

| Department | Slug | Keywords |
|-----------|------|----------|
| Health & Human Services | hhsa | calFresh, medi-cal, wic, benefits, health, mental health, behavioral |
| Resource Management Agency | rma | permit, building, zoning, planning, inspection, code |
| Assessor/Clerk-Recorder | clerk | birth certificate, marriage, death certificate, property, assessment |
| Sheriff's Office | sheriff | report, crime, inmate, jail, warrant |
| Animal Services | animal | dog, cat, pet, stray, adopt, animal, shelter |
| Fire Department | fire | fire, burn, safety, inspection |
| General/Other | general | (catch-all) |

---

## 6. Analytics Dashboard

### Admin route: `/admin`

Simple password-protected page (env var `ADMIN_PASSWORD`). Not SSO — this is a demo.

### Dashboard sections

1. **Overview cards** — Total conversations (today/week/month), avg response time, satisfaction score
2. **Conversations by department** — Bar chart showing which departments get the most questions
3. **Language breakdown** — EN vs ES pie chart
4. **Top questions** — Table of most frequently asked questions (extracted from message content via simple clustering)
5. **Recent conversations** — Scrollable list of recent conversation transcripts for review

### Implementation

- Backend: FastAPI endpoints that query analytics_daily + raw conversation/message tables
- Frontend: Server-rendered Next.js page with Tailwind-styled cards and simple charts (recharts or chart.js)
- No real-time: dashboard refreshes on page load. Adequate for demo.

---

## 7. Docker Packaging

### docker-compose.yml

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [db]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: tulare_chatbot
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-localdev}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  pgdata:
```

### .env.example

```
# Required
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://postgres:localdev@db:5432/tulare_chatbot

# Optional
ADMIN_PASSWORD=demo-admin
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### GET /health endpoint

```json
{"status": "ok", "database": "connected", "model": "claude-haiku-4.5"}
```

---

## 8. Deployment Plan

### Production (free tier)

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Vercel | arthurshafer.com/tulare-chatbot (or subdomain) |
| Backend | Render | tulare-chatbot-api.onrender.com |
| Database | Supabase | (managed connection string) |

### Domain routing

Demo lives at `arthurshafer.com/tulare-chatbot`. Next.js `basePath` config handles the subpath. Vercel project connected to the repo's `/frontend` directory.

### Deployment steps

1. Create Supabase project → run schema migration
2. Run scraper locally → populate content_chunks
3. Deploy FastAPI to Render → set env vars
4. Deploy Next.js to Vercel → set env vars, configure basePath
5. Verify health endpoint, run smoke test

---

## 9. Demo Build Standards Checklist

- [x] **Container packaging** — docker-compose.yml with frontend, backend, db services
- [x] **`.env.example`** — All config vars documented with defaults
- [x] **`GET /health` endpoint** — Returns status, db connectivity, model info
- [x] **Error handling UX** — Designed: API down shows "Service temporarily unavailable, please call..."; Claude fails shows cached fallback; missing data shows department contact
- [x] **Seed data** — Department catalog, scraped content, starter questions
- [x] **Domain routing** — arthurshafer.com/tulare-chatbot with Next.js basePath

---

## 10. Decisions Log

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Architecture | Full-stack (Next.js + FastAPI + pgvector) | Maximum showcase of capability for teaming partners |
| AI Model | Claude Haiku 4.5 | Fast, cheap, good quality with RAG grounding. Upgradeable. |
| Knowledge source | Scrape tularecounty.ca.gov | Real data = most impressive demo |
| Embedding model | all-MiniLM-L6-v2 (local) | Free, no API dependency, adequate quality |
| Hosting | Vercel + Render + Supabase (all free tier) | $0/month hosting, $1-5/month API costs |
| Scope | General county services, all departments | Broadest teaming appeal |
| Demo purpose | Teaming partner outreach to local/regional CA IT firms | Not a formal RFI submission |
| Features | Bilingual EN/ES, SB 313 badge, dept routing, analytics | All four selected by user |
