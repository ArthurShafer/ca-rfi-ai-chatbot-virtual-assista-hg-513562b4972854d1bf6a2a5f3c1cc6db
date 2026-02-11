# Tulare County AI Chatbot — Data Model

## Entity Relationship Diagram

```
departments 1──────────┐
    │                  │
    │ 1:N              │ 1:N
    ▼                  ▼
content_chunks    conversations 1────── messages
                       │                    │
                       │ FK                 │ FK
                       └── department_id    └── department_id
```

## Tables

### departments
County departments that the chatbot can route to.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| name | TEXT | NOT NULL | English department name |
| name_es | TEXT | NOT NULL | Spanish department name |
| slug | TEXT | UNIQUE, NOT NULL | URL-safe identifier (e.g., "hhsa", "rma") |
| description | TEXT | | English description |
| description_es | TEXT | | Spanish description |
| phone | TEXT | | Department phone number |
| email | TEXT | | Department email |
| url | TEXT | | Department website URL |
| keywords | TEXT[] | | Routing keywords (EN + ES) |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**Seed data**: 7 departments (HHSA, RMA, Clerk-Recorder, Sheriff, Animal Services, Fire, General)

### content_chunks
Scraped and chunked county website content with vector embeddings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| department_id | UUID | FK → departments(id) | Which department this content belongs to |
| source_url | TEXT | NOT NULL | Original page URL |
| title | TEXT | | Page or section title |
| content | TEXT | NOT NULL | Chunk text content |
| content_es | TEXT | | Spanish translation (async) |
| embedding | VECTOR(384) | | all-MiniLM-L6-v2 embedding |
| chunk_index | INTEGER | | Position within the source page |
| metadata | JSONB | | Page title, heading hierarchy, etc. |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**Indexes**:
- HNSW index on `embedding` column (cosine similarity, m=16, ef_construction=64)
- B-tree index on `department_id`

### conversations
Chat sessions between users and the bot.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| language | TEXT | DEFAULT 'en' | 'en' or 'es' |
| department_id | UUID | FK → departments(id) | Current routed department |
| started_at | TIMESTAMPTZ | DEFAULT now() | |
| ended_at | TIMESTAMPTZ | | Set when conversation closes |
| message_count | INTEGER | DEFAULT 0 | Running count |
| satisfaction_rating | INTEGER | | 1-5 optional rating |
| metadata | JSONB | | Any additional tracking data |

**Indexes**:
- B-tree index on `started_at` (for analytics queries)

### messages
Individual messages within conversations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| conversation_id | UUID | FK → conversations(id), NOT NULL | Parent conversation |
| role | TEXT | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message text |
| department_id | UUID | FK → departments(id) | Department at time of message |
| tokens_used | INTEGER | | Tokens consumed by this response |
| response_time_ms | INTEGER | | Backend processing time |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**Indexes**:
- B-tree index on `conversation_id` (for loading conversation history)

### analytics_daily
Pre-aggregated daily analytics (future use — queries run on raw tables for demo).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| date | DATE | PK | Calendar date |
| total_conversations | INTEGER | | |
| total_messages | INTEGER | | |
| avg_messages_per_conversation | FLOAT | | |
| avg_response_time_ms | FLOAT | | |
| conversations_by_department | JSONB | | {"hhsa": 45, "rma": 23, ...} |
| conversations_by_language | JSONB | | {"en": 80, "es": 20} |
| top_questions | JSONB | | [{"q": "...", "count": 15}, ...] |
| satisfaction_avg | FLOAT | | |

## Seed Data

| Table | Records | Source |
|-------|---------|--------|
| departments | 7 | Hardcoded from environment-constraints research |
| content_chunks | 500+ (scraped) or 50+ (seed fallback) | Web scraper or seed_content.sql |
