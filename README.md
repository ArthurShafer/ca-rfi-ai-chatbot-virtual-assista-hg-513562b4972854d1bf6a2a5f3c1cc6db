# AI Chatbot & Virtual Assistant Solutions for Tulare County

**CA RFI** | **County of Tulare** | **Deadline: February 12, 2026**

## Live Demo

**https://arthurshafer.com/AI_Chatbot_Virtual_Assistant_Solutions_for_Tulare_County**

## Overview

A bilingual (English/Spanish) AI chatbot that helps Tulare County residents find information about county services. Uses RAG over county website content to provide accurate, grounded answers with source links. Routes conversations to the appropriate department, discloses its AI nature per California SB 313, and meets WCAG 2.1 AA accessibility standards. The frontend follows the California State Web Template (CA.gov Oceanside theme) with the official Tulare County seal.

Built as a teaming partner demo asset for Easy Company Cloudworks LLC.

## Quick Start

```bash
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY
docker compose up --build
```

Frontend: http://localhost:3000
Backend API: http://localhost:8000
Admin dashboard: http://localhost:3000/admin (click Login)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), Tailwind CSS, React 19 |
| Backend | FastAPI (Python 3.12), async |
| LLM | Claude Haiku 4.5 (Anthropic) with Sonnet 4.5 fallback |
| Embeddings | all-MiniLM-L6-v2 (local, no API dependency) |
| Database | PostgreSQL 16 + pgvector |
| Local dev | Docker Compose |

## Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + lifespan
│   │   ├── config.py            # Pydantic settings
│   │   ├── routers/             # health, chat (SSE streaming), analytics
│   │   ├── services/            # llm, rag (vector + keyword), routing
│   │   ├── models/              # Pydantic schemas
│   │   └── db/                  # AsyncPG connection pool
│   ├── db/
│   │   ├── init.sql             # Schema (5 tables, pgvector indexes)
│   │   └── seed_content.sql     # Demo content for 7 departments
│   ├── scripts/
│   │   ├── embed_seed_data.py   # Generate embeddings for seed data
│   │   └── scrape_and_embed.py  # Crawl tularecounty.ca.gov + embed
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                 # Pages (home, admin) + API proxy routes
│   │   ├── components/
│   │   │   ├── chat/            # FloatingChat, ChatWidget, ChatMessage, etc.
│   │   │   ├── dashboard/       # DashboardBackground (CA.gov county website)
│   │   │   ├── providers/       # LanguageProvider (i18n context)
│   │   │   └── layout/          # Header
│   │   └── lib/                 # API helpers, i18n translations
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── architecture/            # System design, data model, API spec
│   ├── solicitation/            # Source materials
│   ├── plans/                   # Feature design docs
│   └── implementation-prompts/  # Build-order implementation prompts
├── docker-compose.yml           # Dev environment
├── docker-compose.prod.yml      # Production (behind reverse proxy)
└── .env.example                 # Environment variable template
```

## Features

- Streaming AI chat with RAG grounding (vector similarity + keyword fallback)
- Bilingual support (English/Spanish) with full i18n
- Department routing (keyword match with sticky sessions)
- SB 313 AI disclosure compliance
- Live agent escalation panel with department phone numbers
- Admin analytics dashboard (conversations, departments, languages, top questions)
- Floating chat widget over CA.gov-style county website
- CA.gov Oceanside theme with official Tulare County seal
- Docker Compose for one-command deployment

## Status

- [x] Environment research
- [x] Feature brainstorming
- [x] Architecture and build plan
- [x] Demo built (all layers)
- [x] Code review and QA
- [x] Technical Response Package
- [x] Deployed to production
- [x] Packaging for prime contractor handoff
