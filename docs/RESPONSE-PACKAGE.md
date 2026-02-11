# Technical Response Package: AI Chatbot & Virtual Assistant for Tulare County

**Prepared by**: Easy Company Cloudworks LLC (Arthur Shafer)
**Solicitation**: RFI 26-040, County of Tulare, California
**Date**: February 11, 2026
**Contact**: sportugal@tularecounty.ca.gov

---

## Executive Summary

This package accompanies a working prototype of an AI-powered chatbot and virtual assistant built specifically for Tulare County's public-facing services. The demo is not a slide deck or a wireframe. It is a fully functional application, deployed and accessible now at:

**Live Demo: https://arthurshafer.com/AI_Chatbot_Virtual_Assistant_Solutions_for_Tulare_County**

The system helps Tulare County residents find information about county services in English and Spanish through a conversational AI interface grounded in actual county website content. It routes conversations to the appropriate department, discloses its AI nature per SB 313, and provides analytics for administrators. The frontend follows the California State Web Template (CA.gov Oceanside theme) and uses the official Tulare County seal.

We built this as a teaming partner asset. The technical implementation is ready. What we bring to a prime contractor is a working solution, architecture documentation, API specifications, deployment playbooks, and cost models. The prime brings contracting credentials, agency relationships, past performance, and bid infrastructure.

---

## 1. Solution Overview

### What It Does

A bilingual AI chatbot that sits as a floating widget on any county web page (or as a standalone interface). Residents type questions in English or Spanish and receive accurate, sourced answers drawn from actual Tulare County website content. The chatbot knows which department to route to, provides phone numbers and links for follow-up, and never fabricates information.

### How It Works

The system uses Retrieval-Augmented Generation (RAG) to ground AI responses in real county content:

1. County website content is scraped, chunked, and stored with vector embeddings in PostgreSQL (pgvector)
2. When a resident asks a question, the system embeds the query and finds the most relevant content chunks via cosine similarity search
3. The relevant content is passed as context to Claude Haiku 4.5 (Anthropic), which generates a conversational response
4. Responses stream back in real time and include source links so residents can verify information
5. If the chatbot cannot answer from its knowledge base, it says so honestly and provides the department phone number

This approach means the chatbot only answers from verified county content. No hallucination. No made-up phone numbers or hours.

### Architecture

```
User (Browser)
    |
    v
Next.js Frontend (React 19, Tailwind CSS)
  - Floating chat widget
  - Admin analytics dashboard
  - Bilingual UI (EN/ES)
  - API proxy routes
    |
    v  HTTPS
FastAPI Backend (Python 3.12, async)
  - Streaming SSE chat endpoint
  - RAG retrieval (vector + keyword fallback)
  - Department routing (keyword match, sticky sessions)
  - Analytics queries
  - Claude Haiku 4.5 integration
    |
    v
PostgreSQL 16 + pgvector
  - Department catalog (7 departments)
  - Content chunks with 384-dim embeddings
  - Conversation and message logging
  - Analytics queries on raw data
```

---

## 2. Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| AI Chat with RAG | Implemented | Grounded responses from county website content with source links |
| Streaming Responses | Implemented | Real-time token-by-token display via Server-Sent Events |
| Bilingual (EN/ES) | Implemented | Full UI and AI responses in English and Spanish |
| Department Routing | Implemented | Keyword-based routing to 7 county departments with sticky sessions |
| SB 313 AI Disclosure | Implemented | Persistent banner identifying the AI nature of the assistant |
| Human Escalation | Implemented | "Talk to a person" with department phone numbers |
| Admin Dashboard | Implemented | Conversation stats, department breakdown, language breakdown, top questions |
| Suggested Questions | Implemented | Language-aware starter questions on first load |
| Markdown Rendering | Implemented | Bot responses render markdown with styled links, lists, and bold text |
| Docker Deployment | Implemented | One-command deployment via Docker Compose |
| Content Scraper | Implemented | Crawls tularecounty.ca.gov and tchhsa.org, chunks, embeds, and stores |

---

## 3. California Regulatory Compliance

This solution was designed with California's AI regulatory environment in mind from the start, not as an afterthought.

### SB 313 (AI Transparency)
The chatbot displays a persistent, non-dismissable banner stating the user is interacting with an AI assistant. A "Talk to a person" option is always visible with department phone numbers. This meets the requirement that GenAI communicating with the public must "clearly and conspicuously identify" the interaction as AI.

### SB 896 (GenAI Accountability Act)
The system maintains full conversation logging for transparency and audit. All AI responses are grounded in retrievable, cited source content. The admin dashboard provides visibility into system behavior.

### SAM 4986 (GenAI State Policy)
Architecture supports CDT sandbox evaluation. Vendor AI disclosure documentation is available. The system uses a commercial AI model (Anthropic Claude) with documented safety properties (Constitutional AI).

### SIMM 5305-F (GenAI Risk Assessment)
This chatbot would classify as Low to Moderate risk under the NIST AI RMF framework:
- It provides informational responses only (not consequential decisions)
- It grounds responses in verified county content (not unconstrained generation)
- It explicitly declines to advise on legal, medical, or financial matters
- It provides escalation paths to human agents for all interactions

### WCAG 2.1 AA Accessibility
The chat interface includes keyboard navigation, ARIA labels on interactive elements, sufficient color contrast ratios (4.5:1+), and semantic HTML structure. This positions the County ahead of the DOJ's April 2026 ADA Title II deadline for WCAG 2.1 AA compliance.

### Dymally-Alatorre Bilingual Services Act
Full Spanish language support is built in, not bolted on. The UI, suggested questions, error messages, and AI responses all render in Spanish. With 66% of Tulare County's population identifying as Hispanic/Latino, bilingual support is not optional.

### Information Practices Act (Privacy)
The system minimizes data collection (no PII required to use the chatbot), maintains conversation logs for operational purposes only, and does not share data with third parties. Retention policies can be configured per county requirements.

---

## 4. Technical Specifications

### Tech Stack

| Layer | Technology | Why This Choice |
|-------|-----------|----------------|
| Frontend | Next.js 16 (App Router), React 19 | Server-side rendering, streaming support, production-grade framework |
| Styling | Tailwind CSS v4 | Rapid UI development, government-appropriate visual design |
| Backend | FastAPI (Python 3.12) | Async-native, fast, strong typing, built for AI/ML workloads |
| LLM | Claude Haiku 4.5 with Sonnet 4.5 fallback | Fast responses (~1-2s), low cost ($0.01/conversation), automatic fallback to stronger model on error |
| Embeddings | all-MiniLM-L6-v2 (sentence-transformers) | Runs locally, no API dependency, no per-query cost, 384 dimensions |
| Database | PostgreSQL 16 + pgvector | Vector search and relational data in one database, mature ecosystem |
| Containerization | Docker Compose | One-command full-stack deployment, reproducible environments |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/chat | None (public) | Send message, receive streaming SSE response |
| GET | /health | None | Service health + DB connectivity check |
| GET | /api/analytics/overview | Admin password | Aggregate stats |
| GET | /api/analytics/departments | Admin password | Conversation counts by department |
| GET | /api/analytics/languages | Admin password | Conversation counts by language |
| GET | /api/analytics/top-questions | Admin password | Most frequent user messages |
| GET | /api/analytics/conversations | Admin password | Recent conversation list with previews |

### Database Schema

Five tables: `departments` (7 seeded), `content_chunks` (with pgvector HNSW index), `conversations`, `messages`, and `analytics_daily` (pre-aggregation, future use). Full schema documented in `docs/architecture/data-model.md`.

### Performance Characteristics

| Metric | Value |
|--------|-------|
| Response latency (first token) | ~500ms |
| Full response time | 1-3 seconds typical |
| Vector search time | <50ms (HNSW index) |
| Embedding generation | ~100ms per query |
| Concurrent conversations | Limited by DB pool (2-5 connections, configurable) |
| Cost per conversation | ~$0.01 (Claude Haiku 4.5) |

---

## 5. Deployment Options

### Option A: Docker Compose (Demo / Evaluation)

```bash
cp .env.example .env
# Set ANTHROPIC_API_KEY
docker compose up --build
```

Runs the full stack locally. Frontend at `localhost:3000`, backend at `localhost:8000`, PostgreSQL at `localhost:5432`. Database schema and seed data load automatically on first run.

### Option B: Cloud Deployment (Production Path)

| Component | Recommended Service | Alternative |
|-----------|-------------------|-------------|
| Frontend | Vercel | AWS Amplify, Azure Static Web Apps |
| Backend | Render, AWS ECS, Azure App Service | Any container hosting |
| Database | Supabase, AWS RDS, Azure Database for PostgreSQL | Any managed PostgreSQL with pgvector |

All components are stateless (except the database) and can be deployed to any container-compatible hosting. The architecture does not lock in to any specific cloud vendor.

### Option C: On-Premises

Docker Compose works on any Linux server. The only external dependency is the Anthropic API for Claude access (HTTPS outbound on port 443). All other components run locally, including the embedding model.

---

## 6. Cost Model

### Demo Phase (Current)

| Item | Monthly Cost |
|------|-------------|
| Hosting (free tier services) | $0 |
| Claude API (light demo traffic) | $1-5 |
| **Total** | **$1-5/month** |

### Pilot Phase (100-500 conversations/day)

| Item | Monthly Cost |
|------|-------------|
| Cloud hosting (basic tier) | $50-150 |
| Claude API | $30-150 |
| Database (managed PostgreSQL) | $25-50 |
| **Total** | **$105-350/month** |

### Production Phase (1,000+ conversations/day)

| Item | Monthly Cost |
|------|-------------|
| Cloud hosting (production tier) | $200-500 |
| Claude API | $300-1,500 |
| Database (managed, HA) | $100-300 |
| Monitoring/logging | $50-100 |
| **Total** | **$650-2,400/month** |

Cost scales linearly with usage. The largest variable is Claude API calls. Upgrading from Haiku to Sonnet (for higher quality responses) increases the LLM line item by roughly 10x but may be warranted for complex use cases.

---

## 7. Integration Roadmap

The demo's clean API layer is designed for future integration with county systems:

| Integration | Approach | Complexity |
|-------------|----------|-----------|
| Live agent handoff | WebSocket bridge to county call center software | Medium |
| CGI Advantage 4 Cloud | REST API adapter for financial/vendor queries | Medium |
| Esri ArcGIS | Location-based service routing via ArcGIS REST API | Low |
| Tyler EnerGov | Permit status lookup via EnerGov API | Medium |
| 211 Tulare County | Referral data feed for housing, food, utilities | Low |
| Active Directory / SSO | SAML/OIDC adapter for admin authentication | Low |
| Multi-language expansion | Add language codes to i18n config; Claude supports 50+ languages natively | Low |

---

## 8. What We Bring to a Teaming Arrangement

**Easy Company Cloudworks LLC** (Arthur Shafer) is an independent technologist specializing in AI/ML engineering, AWS cloud architecture, and full-stack web development.

### Deliverables ready now:
- Working prototype (this demo)
- Architecture documentation (`docs/architecture/`)
- API specification (`docs/architecture/api-spec.md`)
- Data model documentation (`docs/architecture/data-model.md`)
- Docker deployment configuration
- Content scraping pipeline
- This response package

### What we handle in a teaming arrangement:
- All AI/ML engineering (RAG pipeline, LLM integration, embedding models)
- Backend API development and deployment
- Frontend development
- Database design and optimization
- Cloud infrastructure and DevOps
- Technical documentation for the proposal's technical volume

### What the prime contractor handles:
- Government contracting credentials and certifications
- Agency relationships and past performance references
- Insurance, bonding, and corporate compliance
- Bid management and proposal writing
- Contract administration
- Certifications (8(a), SDVOSB, HUBZone, WOSB as applicable)

---

## 9. Running the Demo

### Prerequisites
- Docker and Docker Compose
- An Anthropic API key (get one at console.anthropic.com)

### Steps

```bash
git clone <repo-url>
cd ca-rfi-ai-chatbot-virtual-assista-hg-513562b4972854d1bf6a2a5f3c1cc6db
cp .env.example .env
# Edit .env: set ANTHROPIC_API_KEY=sk-ant-...
docker compose up --build
```

Then open:
- **Chat interface**: http://localhost:3000
- **Admin dashboard**: http://localhost:3000/admin (click Login)
- **API health check**: http://localhost:8000/health

Or view the live deployment at: **https://arthurshafer.com/AI_Chatbot_Virtual_Assistant_Solutions_for_Tulare_County**

### Demo Walkthrough (15 minutes)

1. **County website** (2 min): Show the main page designed after the CA.gov State Web Template with the official Tulare County seal. Point out the floating chat widget in the bottom-right corner, the SB 313 disclosure banner, and the EN/ES language toggle.

2. **English conversation** (3 min): Ask "How do I apply for CalFresh benefits?" Watch the streaming response with source links. Note the department badge (HHSA) and the grounded answer.

3. **Spanish conversation** (2 min): Toggle to Spanish. Ask "Como solicito beneficios de CalFresh?" Show the full UI switches to Spanish and the AI responds in Spanish.

4. **Department routing** (2 min): Ask "I need a building permit" and watch the department change to Resource Management Agency. Ask a follow-up in the same conversation to show sticky routing.

5. **Escalation** (1 min): Click "Talk to a person" to show the escalation panel with department phone numbers.

6. **Admin dashboard** (3 min): Click "Admin Dashboard" in the header, then "Login." Show conversation stats, department breakdown chart, language donut chart, top questions, and recent conversations with the period selector (7/30/90 days).

7. **Architecture walkthrough** (2 min): Show the Docker Compose setup, the API spec, the RAG pipeline. Emphasize the clean separation between frontend and backend ("you build the UI, we provide the API").

---

## 10. Repository Contents

```
backend/           FastAPI backend (Python 3.12)
  app/             Application code (routers, services, models)
  db/              SQL schema and seed data
  scripts/         Content scraper and embedding utilities
frontend/          Next.js frontend (React 19, Tailwind CSS)
  src/             Pages, components, i18n, API helpers
docs/
  architecture/    System design, data model, API spec
  plans/           Feature design documents
  requirements/    Environment constraints research
  solicitation/    Source materials
docker-compose.yml         Development environment
docker-compose.prod.yml    Production configuration
.env.example               Environment variable template
RESPONSE-PACKAGE.md        This document
```

---

*Prepared by Easy Company Cloudworks LLC. For questions, contact Arthur Shafer.*
