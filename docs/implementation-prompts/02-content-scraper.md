# Implementation Prompt: Content Scraper & Embedding Pipeline

## Metadata
- **Order**: 2
- **Dependencies**: 01-database-schema (needs tables to load into)
- **Skills**: fastapi-templates
- **Scope**: Medium
- **Estimated Tokens**: ~100K

## Context
The database schema exists with content_chunks and departments tables. We need to populate the knowledge base by scraping Tulare County's website and generating embeddings. This is a one-time pipeline (run during setup), not a real-time service.

## Objective
Build a Python scraper that crawls tularecounty.ca.gov and tchhsa.org, extracts text content, chunks it semantically, generates embeddings with all-MiniLM-L6-v2, classifies chunks by department, and loads everything into the content_chunks table.

## Requirements
- Python script at `backend/scripts/scrape_and_embed.py`
- Crawl tularecounty.ca.gov starting from the department directory page, follow internal links, max depth 3
- Crawl tchhsa.org for HHSA-specific content (benefits, public health, behavioral health)
- Extract text using BeautifulSoup or similar — strip HTML, preserve heading structure
- Chunk by heading sections (~500 tokens per chunk, 50-token overlap between chunks)
- Assign department_id based on URL path mapping (e.g., /rma/* → RMA, /hrd/* → General, tchhsa.org/* → HHSA)
- Generate embeddings using sentence-transformers all-MiniLM-L6-v2 (local, no API key needed)
- Insert chunks into content_chunks table via psycopg2 or asyncpg
- Handle 403/rate-limiting gracefully — add delays between requests, respect robots.txt
- Log progress: pages crawled, chunks created, errors encountered
- Requirements: beautifulsoup4, requests, sentence-transformers, psycopg2-binary, torch

## Acceptance Criteria
- Script runs with `python backend/scripts/scrape_and_embed.py`
- Successfully crawls 100+ pages from tularecounty.ca.gov
- Generates 500+ content chunks with embeddings
- All chunks have department_id assigned
- Chunks are retrievable via pgvector cosine similarity query
- Script is idempotent (can re-run without duplicating data — truncates content_chunks first)
- Completes in under 15 minutes

## Technical Notes
- tularecounty.ca.gov returned 403 on direct fetch during research — may need to set a proper User-Agent header
- URL-to-department mapping: /rma/ → RMA, /hrd/ → General, /board/ → General, /sheriff/ → Sheriff, /fire/ → Fire, /assessor/ → Clerk-Recorder, /animal-services/ → Animal Services, tchhsa.org → HHSA
- If scraping fails entirely (persistent 403s), fall back to creating curated seed content from the information gathered during environment-constraints research
- Store source_url on each chunk so the chatbot can cite sources
- Set chunk metadata JSONB to include page title and heading hierarchy
