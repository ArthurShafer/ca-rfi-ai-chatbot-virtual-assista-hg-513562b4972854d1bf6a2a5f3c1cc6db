# Implementation Prompt: Database Schema & pgvector Setup

## Metadata
- **Order**: 1
- **Dependencies**: None (foundation)
- **Skills**: postgresql-table-design
- **Scope**: Small
- **Estimated Tokens**: ~50K

## Context
Greenfield project. We are building an AI chatbot for Tulare County, CA. The database layer is the foundation — everything else builds on this. We are using Supabase (hosted PostgreSQL with pgvector extension built in) for production, and pgvector/pgvector:pg16 Docker image for local development.

## Objective
Create the complete database schema for the Tulare County chatbot, including pgvector extension, all tables, indexes, and an init.sql file that can bootstrap both local Docker and Supabase environments.

## Requirements
- Enable pgvector extension
- Create `departments` table with EN/ES name and description, slug, phone, email, url, keywords array
- Create `content_chunks` table with source_url, title, content, content_es, embedding VECTOR(384), chunk_index, department_id FK, metadata JSONB
- Create `conversations` table with language, department_id, timestamps, message_count, satisfaction_rating
- Create `messages` table with conversation_id FK, role (user/assistant), content, department_id, tokens_used, response_time_ms
- Create `analytics_daily` table with date PK and aggregated JSONB fields
- Create HNSW index on content_chunks.embedding for fast cosine similarity search
- Create indexes on conversations(started_at), messages(conversation_id), content_chunks(department_id)
- Seed the `departments` table with 7 departments: HHSA, RMA, Clerk-Recorder, Sheriff, Animal Services, Fire, General
- All tables use UUID primary keys with gen_random_uuid() default
- All tables have created_at TIMESTAMPTZ DEFAULT now()

## Acceptance Criteria
- `backend/db/init.sql` exists and runs cleanly on a fresh PostgreSQL 16 + pgvector instance
- All tables created with correct types, constraints, and indexes
- 7 departments seeded with realistic Tulare County data (real phone numbers and URLs from environment-constraints research)
- pgvector HNSW index created on embedding column
- File can be used as Docker entrypoint init script AND run manually against Supabase

## Technical Notes
- Use VECTOR(384) — we are using all-MiniLM-L6-v2 embeddings (384 dimensions)
- HNSW index params: m=16, ef_construction=64 (good defaults for <1M vectors)
- Department keywords should be comprehensive enough for keyword-based routing
- Include both EN and ES department names from environment-constraints doc
- Keep the schema simple — no stored procedures, no triggers, no materialized views for now
