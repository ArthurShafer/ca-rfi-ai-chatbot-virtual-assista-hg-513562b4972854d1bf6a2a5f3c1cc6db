"""
Tulare County Website Scraper & Embedding Pipeline

Crawls tularecounty.ca.gov and tchhsa.org, chunks content,
generates embeddings with all-MiniLM-L6-v2, and loads into pgvector.

Usage:
    python backend/scripts/scrape_and_embed.py

Environment:
    DATABASE_URL - PostgreSQL connection string
"""

import hashlib
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Optional
from urllib.parse import urljoin, urlparse

import psycopg2
import psycopg2.extras
import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# Try importing sentence_transformers; fall back to None if not available
try:
    from sentence_transformers import SentenceTransformer

    EMBEDDING_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Loaded sentence-transformers all-MiniLM-L6-v2")
except ImportError:
    EMBEDDING_MODEL = None
    logger.warning(
        "sentence-transformers not installed. Will skip embedding generation. "
        "Install with: pip install sentence-transformers"
    )

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:localdev@localhost:5432/tulare_chatbot",
)

# URL to department slug mapping
URL_DEPARTMENT_MAP = {
    "/rma/": "rma",
    "/permits": "rma",
    "/planning": "rma",
    "/assessor/": "clerk",
    "/clerk": "clerk",
    "/sheriff/": "sheriff",
    "/fire/": "fire",
    "/animal": "animal",
    "/hrd/": "general",
    "/board/": "general",
    "/purchasing/": "general",
    "/county/": "general",
    "/tcict/": "general",
}

HHSA_DOMAINS = ["tchhsa.org"]

SEED_URLS = [
    "https://tularecounty.ca.gov/department-directory",
    "https://tularecounty.ca.gov/rma/permits",
    "https://tularecounty.ca.gov/assessor",
    "https://tularecounty.ca.gov/sheriff",
    "https://tularecounty.ca.gov/fire",
    "https://tularecounty.ca.gov/animal-services",
    "https://tularecounty.ca.gov/county/about",
    "https://tularecounty.ca.gov/hrd/careers",
    "https://tchhsa.org/eng/benefits",
    "https://tchhsa.org/eng/public-health",
    "https://tchhsa.org/eng/behavioral-health",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

MAX_DEPTH = 3
MAX_PAGES = 200
CHUNK_SIZE = 500  # tokens (approx chars / 4)
CHUNK_OVERLAP = 50
REQUEST_DELAY = 1.0  # seconds between requests


@dataclass
class ContentChunk:
    source_url: str
    title: str
    content: str
    department_slug: str
    chunk_index: int
    metadata: dict = field(default_factory=dict)
    embedding: Optional[list] = None


def classify_department(url: str) -> str:
    """Determine department slug from URL path."""
    parsed = urlparse(url)

    # Check HHSA domains
    for domain in HHSA_DOMAINS:
        if domain in parsed.netloc:
            return "hhsa"

    # Check path patterns
    path = parsed.path.lower()
    for pattern, slug in URL_DEPARTMENT_MAP.items():
        if pattern in path:
            return slug

    return "general"


def fetch_page(url: str, session: requests.Session) -> Optional[str]:
    """Fetch a page with error handling and rate limiting."""
    try:
        time.sleep(REQUEST_DELAY)
        resp = session.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        if resp.status_code == 200:
            return resp.text
        logger.warning("HTTP %d for %s", resp.status_code, url)
        return None
    except requests.RequestException as e:
        logger.warning("Request failed for %s: %s", url, e)
        return None


def extract_text(html: str) -> tuple[str, str, list[str]]:
    """Extract title, main text content, and internal links from HTML."""
    soup = BeautifulSoup(html, "html.parser")

    # Remove script, style, nav, footer, header elements
    for tag in soup.find_all(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()

    title = ""
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)

    # Try to find main content area
    main = soup.find("main") or soup.find("article") or soup.find(
        "div", {"role": "main"}
    )
    if not main:
        main = soup.find("body") or soup

    # Extract text preserving structure
    text_parts = []
    for element in main.find_all(["h1", "h2", "h3", "h4", "p", "li", "td"]):
        text = element.get_text(strip=True)
        if text and len(text) > 10:
            if element.name.startswith("h"):
                text_parts.append(f"\n## {text}\n")
            else:
                text_parts.append(text)

    full_text = "\n".join(text_parts)

    # Extract internal links
    links = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"]
        if href.startswith("/") or "tularecounty.ca.gov" in href or "tchhsa.org" in href:
            links.append(href)

    return title, full_text, links


def chunk_text(text: str, title: str, max_chars: int = 2000, overlap_chars: int = 200) -> list[str]:
    """Split text into chunks by paragraphs/sections, respecting boundaries."""
    if not text.strip():
        return []

    # Split on double newlines (section boundaries)
    sections = re.split(r"\n\n+", text)
    chunks = []
    current_chunk = f"{title}\n\n" if title else ""

    for section in sections:
        section = section.strip()
        if not section:
            continue

        if len(current_chunk) + len(section) > max_chars and current_chunk.strip():
            chunks.append(current_chunk.strip())
            # Start new chunk with overlap from end of previous
            overlap = current_chunk[-overlap_chars:] if len(current_chunk) > overlap_chars else ""
            current_chunk = overlap + "\n" + section
        else:
            current_chunk += "\n" + section

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def generate_embeddings(texts: list[str]) -> list[Optional[list[float]]]:
    """Generate embeddings for a list of texts."""
    if EMBEDDING_MODEL is None:
        return [None] * len(texts)

    embeddings = EMBEDDING_MODEL.encode(texts, show_progress_bar=True)
    return [emb.tolist() for emb in embeddings]


def crawl(seed_urls: list[str], max_pages: int = MAX_PAGES, max_depth: int = MAX_DEPTH) -> list[ContentChunk]:
    """Crawl starting from seed URLs, extract and chunk content."""
    visited = set()
    queue = [(url, 0) for url in seed_urls]  # (url, depth)
    all_chunks = []
    session = requests.Session()
    pages_crawled = 0

    while queue and pages_crawled < max_pages:
        url, depth = queue.pop(0)

        # Normalize URL
        url = url.split("#")[0].split("?")[0].rstrip("/")
        if url in visited:
            continue

        # Only follow links within allowed domains
        parsed = urlparse(url)
        if parsed.netloc and parsed.netloc not in [
            "tularecounty.ca.gov",
            "www.tularecounty.ca.gov",
            "tchhsa.org",
            "www.tchhsa.org",
        ]:
            continue

        visited.add(url)
        logger.info("Crawling [depth=%d] %s", depth, url)

        html = fetch_page(url, session)
        if not html:
            continue

        pages_crawled += 1
        title, text, links = extract_text(html)

        if len(text.strip()) < 50:
            logger.info("  Skipping (too little content): %s", url)
            continue

        department_slug = classify_department(url)
        chunks = chunk_text(text, title)

        for i, chunk_text_content in enumerate(chunks):
            all_chunks.append(
                ContentChunk(
                    source_url=url,
                    title=title,
                    content=chunk_text_content,
                    department_slug=department_slug,
                    chunk_index=i,
                    metadata={"page_title": title, "depth": depth},
                )
            )

        # Add discovered links to queue
        if depth < max_depth:
            for link in links:
                full_url = urljoin(url, link).split("#")[0].split("?")[0].rstrip("/")
                if full_url not in visited:
                    queue.append((full_url, depth + 1))

    logger.info("Crawled %d pages, produced %d chunks", pages_crawled, len(all_chunks))
    return all_chunks


def load_to_database(chunks: list[ContentChunk], conn):
    """Load chunks into the content_chunks table."""
    cur = conn.cursor()

    # Get department ID mapping
    cur.execute("SELECT slug, id FROM departments")
    dept_map = dict(cur.fetchall())

    # Clear existing chunks (idempotent)
    cur.execute("TRUNCATE content_chunks")
    logger.info("Cleared existing content_chunks")

    # Generate embeddings in batch
    texts = [c.content for c in chunks]
    logger.info("Generating embeddings for %d chunks...", len(texts))
    embeddings = generate_embeddings(texts)

    # Insert chunks
    inserted = 0
    for chunk, embedding in zip(chunks, embeddings):
        dept_id = dept_map.get(chunk.department_slug)
        if not dept_id:
            dept_id = dept_map.get("general")

        cur.execute(
            """
            INSERT INTO content_chunks
                (department_id, source_url, title, content, embedding, chunk_index, metadata)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                dept_id,
                chunk.source_url,
                chunk.title,
                chunk.content,
                embedding,
                chunk.chunk_index,
                json.dumps(chunk.metadata),
            ),
        )
        inserted += 1

    conn.commit()
    logger.info("Inserted %d chunks into content_chunks", inserted)


def main():
    logger.info("Starting Tulare County content scraper")
    logger.info("Database: %s", DATABASE_URL.split("@")[-1])  # Log without password

    # Crawl
    chunks = crawl(SEED_URLS)

    if not chunks:
        logger.error("No content scraped. Check network access to tularecounty.ca.gov")
        logger.info("Run seed_content.sql instead for fallback content.")
        sys.exit(1)

    # Load to database
    conn = psycopg2.connect(DATABASE_URL)
    try:
        load_to_database(chunks, conn)
    finally:
        conn.close()

    logger.info("Done! %d chunks loaded.", len(chunks))


if __name__ == "__main__":
    main()
