"""Embed seed data that has NULL embeddings in the database.

Usage:
    python -m scripts.embed_seed_data

Requires DATABASE_URL environment variable.
"""

import os
import sys

import numpy as np
import psycopg2
from sentence_transformers import SentenceTransformer

DATABASE_URL = os.environ.get(
    "DATABASE_URL", "postgresql://postgres:localdev@localhost:5432/tulare_chatbot"
)

def main():
    print("Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Find chunks without embeddings
    cur.execute("SELECT id, content FROM content_chunks WHERE embedding IS NULL")
    rows = cur.fetchall()

    if not rows:
        print("All content chunks already have embeddings.")
        return

    print(f"Embedding {len(rows)} content chunks...")

    for chunk_id, content in rows:
        embedding = model.encode(content).tolist()
        cur.execute(
            "UPDATE content_chunks SET embedding = %s::vector WHERE id = %s",
            (str(embedding), chunk_id),
        )
        print(f"  Embedded chunk {chunk_id}")

    conn.commit()
    cur.close()
    conn.close()
    print("Done!")


if __name__ == "__main__":
    main()
