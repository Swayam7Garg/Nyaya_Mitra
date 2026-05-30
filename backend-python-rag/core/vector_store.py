"""
core/vector_store.py
--------------------
PostgreSQL pgvector implementation of the vector store.
Replaces ChromaDB to use the centralized Supabase database.

Uses psycopg2 connection pooling to stay within Supabase's
connection limits (pool_size: 15).
"""

import os
import psycopg2
import psycopg2.pool
from psycopg2.extras import Json, execute_values
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()


class PgVectorCollection:
    def __init__(self):
        self.db_url = os.getenv("SUPABASE_DB_URL")
        if not self.db_url:
            raise ValueError("SUPABASE_DB_URL is not set in environment")

        # Create a connection pool: min 1, max 5 connections
        # This prevents exhausting Supabase's 15-connection limit
        self._pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=5,
            dsn=self.db_url,
        )

    @contextmanager
    def _get_conn(self):
        """Get a connection from the pool. Always returns it when done."""
        conn = self._pool.getconn()
        try:
            register_vector(conn)
            yield conn
        except Exception:
            conn.rollback()
            raise
        finally:
            self._pool.putconn(conn)

    def count(self) -> int:
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM document_embeddings")
                return cur.fetchone()[0]

    def upsert(self, ids: list[str], embeddings: list[list[float]], documents: list[str], metadatas: list[dict]):
        args = [(i, str(emb), doc, Json(meta)) for i, emb, doc, meta in zip(ids, embeddings, documents, metadatas)]
        with self._get_conn() as conn:
            with conn.cursor() as cur:
                execute_values(
                    cur,
                    """
                    INSERT INTO document_embeddings (id, embedding, document, metadata)
                    VALUES %s
                    ON CONFLICT (id) DO UPDATE SET
                        embedding = EXCLUDED.embedding,
                        document = EXCLUDED.document,
                        metadata = EXCLUDED.metadata,
                        created_at = NOW()
                    """,
                    args,
                    template="(%s, %s::vector, %s, %s)"
                )
            conn.commit()

    def query(self, query_embeddings: list[list[float]], n_results: int, include: list[str] = None):
        query_emb = query_embeddings[0]

        with self._get_conn() as conn:
            with conn.cursor() as cur:
                # pgvector cosine distance is <=>
                # cosine similarity = 1 - cosine distance
                cur.execute(
                    """
                    SELECT document, metadata, embedding <=> %s::vector AS distance
                    FROM document_embeddings
                    ORDER BY distance
                    LIMIT %s
                    """,
                    (str(query_emb), n_results)
                )
                rows = cur.fetchall()

        # Format the result like ChromaDB
        return {
            "documents": [[r[0] for r in rows]],
            "metadatas": [[r[1] for r in rows]],
            "distances": [[float(r[2]) for r in rows]]
        }


_collection = None

def get_collection():
    global _collection
    if _collection is None:
        _collection = PgVectorCollection()
    return _collection

def collection_stats() -> dict:
    col = get_collection()
    total = col.count()
    return {
        "collection": "document_embeddings",
        "total_chunks": total,
        "count": total,
        "chroma_server": "pgvector_supabase",
    }
