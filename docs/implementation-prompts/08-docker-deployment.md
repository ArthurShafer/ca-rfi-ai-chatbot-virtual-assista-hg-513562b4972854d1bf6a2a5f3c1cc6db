# Implementation Prompt: Docker Compose & Deployment

## Metadata
- **Order**: 8
- **Dependencies**: 03-fastapi-backend, 05-nextjs-frontend-shell (all app code must exist)
- **Skills**: docker-expert
- **Scope**: Small
- **Estimated Tokens**: ~60K

## Context
Both the FastAPI backend and Next.js frontend are built and working locally. We need Docker Compose for local development and deployment configs for Vercel (frontend), Render (backend), and Supabase (database).

## Objective
Create Docker Compose configuration for local development, Dockerfiles for both services, .env.example, and deployment documentation for the free-tier production stack.

## Requirements

### Docker Compose (local development)
- `docker-compose.yml` at project root with 3 services:
  - **db**: pgvector/pgvector:pg16, port 5432, init.sql as entrypoint script, named volume for data
  - **backend**: Build from ./backend, port 8000, depends_on db, health check via /health
  - **frontend**: Build from ./frontend, port 3000, depends_on backend
- `.env.example` at project root with all required and optional env vars documented
- `docker-compose.override.yml` for development (hot reload, volume mounts)

### Backend Dockerfile (`backend/Dockerfile`)
- Python 3.11-slim base
- Install requirements.txt
- Install sentence-transformers model at build time (so it's cached in the image)
- Run with uvicorn on port 8000
- Non-root user for security

### Frontend Dockerfile (`frontend/Dockerfile`)
- Node 20-alpine base
- Multi-stage: install deps → build → serve with standalone output
- Run on port 3000
- Non-root user

### .env.example
```
# Required
ANTHROPIC_API_KEY=sk-ant-...your-key-here
DATABASE_URL=postgresql://postgres:localdev@db:5432/tulare_chatbot

# Optional
ADMIN_PASSWORD=demo-admin
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BASE_PATH=/tulare-chatbot
```

### Deployment docs
- `DEPLOYMENT.md` at project root with step-by-step instructions for:
  1. Supabase setup (create project, run init.sql, get connection string)
  2. Run scraper to populate content
  3. Render deployment (connect repo, set env vars, deploy backend)
  4. Vercel deployment (connect repo, set env vars, configure basePath)
  5. Verify health endpoint and smoke test

## Acceptance Criteria
- `docker compose up` starts all 3 services from a clean state
- Backend health check passes within 30 seconds
- Frontend is accessible at http://localhost:3000/tulare-chatbot
- Chat works end-to-end through Docker Compose
- `docker compose down -v` cleanly stops and removes everything
- DEPLOYMENT.md is clear enough for a non-AI-expert to follow

## Technical Notes
- The sentence-transformers model download in the backend Dockerfile is ~90MB — cache it in a Docker layer so rebuilds are fast
- Frontend standalone output mode reduces the Next.js image from ~1GB to ~200MB
- Render free tier sleeps after 15min idle — first request takes ~30s to wake. This is fine for demo traffic.
- Supabase free tier connection string format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
- For Vercel, basePath must be configured both in next.config.ts and in the Vercel project settings
