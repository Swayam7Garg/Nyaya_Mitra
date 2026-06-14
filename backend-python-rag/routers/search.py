"""
routers/search.py
-----------------
Phase 4 — Retrieval + Generation (RAG Query) Router

POST /search — Takes a user question, finds relevant legal doc chunks
               from ChromaDB, and returns a Gemini-grounded answer.

GET  /search/debug — Returns raw retrieved chunks without LLM generation
                     (useful for testing retrieval quality).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from google import genai
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

from core.vector_store import get_collection
from services.generation_service import generate_answer

router = APIRouter(prefix="/search", tags=["RAG Search"])

# ── Configure Gemini embedding for query ──────────────────────────────────────
_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None


# ── Request / Response models ─────────────────────────────────────────────────
class SearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=2000,
                       description="Legal question in Hindi or English")
    top_k: int = Field(default=5, ge=1, le=20,
                       description="Number of context chunks to retrieve")
    language: str = Field(default="auto",
                          description="'hi' | 'en' | 'auto'")


class SourceChunk(BaseModel):
    filename: str
    chunk_index: int
    score: float
    preview: str  # first 200 chars


class SearchResponse(BaseModel):
    query: str
    answer: str
    sources: list[str]
    chunks_used: int
    context_previews: list[SourceChunk]


class DebugSearchResponse(BaseModel):
    query: str
    chunks: list[dict]
    total_found: int


# ── Helpers ───────────────────────────────────────────────────────────────────
def _embed_query(text: str) -> list[float]:
    """Generate a RETRIEVAL_QUERY embedding for the user question."""
    if not _client:
        raise RuntimeError("Gemini API key not configured")
    result = _client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config={
            "task_type": "RETRIEVAL_QUERY",
            "output_dimensionality": 768,
        },
    )
    return result.embeddings[0].values


def _retrieve(query: str, top_k: int) -> list[dict]:
    """
    Query ChromaDB for the top_k most relevant chunks.
    Returns list of dicts: {text, filename, chunk_index, total_chunks, score}
    """
    # ── TEMPORARY DEBUG LOGS ──────────────────────────────────────────────────
    print(f"\n[DEBUG] [Retrieval Stage] Querying ChromaDB.")
    print(f"[DEBUG] [Retrieval Stage] Query: '{query}', top_k: {top_k}")

    collection = get_collection()

    if collection.count() == 0:
        print(f"[DEBUG] [Retrieval Stage] ChromaDB collection is empty! Returning 0 chunks.")
        return []

    query_embedding = _embed_query(query)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for doc, meta, dist in zip(docs, metas, distances):
        # Convert cosine distance → similarity score (0–1)
        score = round(1 - dist, 4)
        chunks.append({
            "text": doc,
            "filename": meta.get("filename", "unknown"),
            "chunk_index": meta.get("chunk_index", 0),
            "total_chunks": meta.get("total_chunks", 0),
            "score": score,
            "metadata": meta,  # full metadata for title/source_url display
        })

    # Sort by relevance score descending
    chunks.sort(key=lambda x: x["score"], reverse=True)
    
    print(f"[DEBUG] [Retrieval Stage] Successfully retrieved {len(chunks)} relevant chunks from ChromaDB.")
    print(f"[DEBUG] [Retrieval Stage] -----------------------------------------")
    return chunks


# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.post("", response_model=SearchResponse, summary="Ask a legal question")
async def search(request: SearchRequest):
    """
    Full RAG pipeline:
    1. Embed the query with Gemini (RETRIEVAL_QUERY task)
    2. Find top_k similar chunks in ChromaDB
    3. Pass chunks + question to Gemini 1.5 Flash for a grounded answer
    4. Return answer with source citations
    """
    try:
        chunks = _retrieve(request.query, request.top_k)
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"ChromaDB retrieval failed: {e}. "
                   "Is the ChromaDB Docker container running? (docker compose up -d)"
        )

    if not chunks:
        no_docs_msg = (
            "अभी तक कोई दस्तावेज़ अपलोड नहीं हुआ है। कृपया पहले Knowledge Base में कानूनी PDF अपलोड करें। / "
            "No documents have been ingested yet. Please upload legal PDFs via the Knowledge Base page first."
        )
        return SearchResponse(
            query=request.query,
            answer=no_docs_msg,
            sources=[],
            chunks_used=0,
            context_previews=[],
        )

    try:
        result = generate_answer(request.query, chunks, language=request.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini generation failed: {e}")

    context_previews = [
        SourceChunk(
            filename=c["filename"],
            chunk_index=c["chunk_index"],
            score=c["score"],
            preview=c["text"][:200] + ("..." if len(c["text"]) > 200 else ""),
        )
        for c in chunks
    ]

    return SearchResponse(
        query=request.query,
        answer=result["answer"],
        sources=result["sources"],
        chunks_used=len(chunks),
        context_previews=context_previews,
    )


@router.post("/debug", response_model=DebugSearchResponse,
             summary="Debug: view raw retrieved chunks (no LLM)")
async def debug_search(request: SearchRequest):
    """
    Returns raw retrieved chunks without calling Gemini.
    Use this to validate retrieval quality before adding the LLM layer.
    """
    try:
        chunks = _retrieve(request.query, request.top_k)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"ChromaDB retrieval failed: {e}")

    return DebugSearchResponse(
        query=request.query,
        chunks=chunks,
        total_found=len(chunks),
    )


# ── GET /search/knowledge-base ────────────────────────────────────────────────
# Admin-only endpoint: list all unique documents indexed in the vector store

class KBDocument(BaseModel):
    id: str
    title: str
    category: str
    source_url: str
    filename: str
    created_at: str


class KBListResponse(BaseModel):
    total_chunks: int
    documents: list[KBDocument]


@router.get("/knowledge-base", response_model=KBListResponse,
            summary="Admin: List all indexed documents in the knowledge base")
async def list_knowledge_base():
    """
    Returns all unique documents stored in the pgvector knowledge base.
    Intended for admin use to browse what has been indexed.
    """
    db_url = (os.getenv("SUPABASE_DB_URL") or "").strip()
    if not db_url:
        raise HTTPException(status_code=500, detail="SUPABASE_DB_URL not configured")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id,
                   metadata->>'title'      AS title,
                   metadata->>'category'   AS category,
                   metadata->>'source_url' AS source_url,
                   metadata->>'filename'   AS filename,
                   created_at::text        AS created_at
            FROM document_embeddings
            ORDER BY created_at DESC
            LIMIT 200
            """
        )
        rows = cur.fetchall()
        cur.execute("SELECT COUNT(*) FROM document_embeddings")
        total = cur.fetchone()[0]
        cur.close()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    docs = [
        KBDocument(
            id=row[0] or "",
            title=row[1] or "Untitled",
            category=row[2] or "general",
            source_url=row[3] or "",
            filename=row[4] or "",
            created_at=row[5] or "",
        )
        for row in rows
    ]
    return KBListResponse(total_chunks=total, documents=docs)


# ── POST /search/knowledge-base/query ────────────────────────────────────────
# Admin semantic search — raw chunks, no LLM, with scores

class KBQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    top_k: int = Field(default=8, ge=1, le=20)


class KBChunk(BaseModel):
    id: str
    title: str
    category: str
    source_url: str
    score: float
    preview: str


class KBQueryResponse(BaseModel):
    query: str
    results: list[KBChunk]
    total_found: int


@router.post("/knowledge-base/query", response_model=KBQueryResponse,
             summary="Admin: Semantic search the knowledge base (no LLM)")
async def query_knowledge_base(request: KBQueryRequest):
    """
    Searches the pgvector knowledge base semantically and returns
    the top matching chunks with similarity scores and source info.
    Admin-only tool to test retrieval quality.
    """
    try:
        chunks = _retrieve(request.query, request.top_k)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Retrieval failed: {e}")

    results = []
    for chunk in chunks:
        meta = chunk.get("metadata") or {}
        results.append(KBChunk(
            id=chunk.get("filename", ""),
            title=meta.get("title") or meta.get("filename") or chunk.get("filename", "unknown"),
            category=meta.get("category", "general"),
            source_url=meta.get("source_url", ""),
            score=round(chunk["score"], 4),
            preview=chunk["text"][:300] + ("..." if len(chunk["text"]) > 300 else ""),
        ))

    return KBQueryResponse(
        query=request.query,
        results=results,
        total_found=len(results),
    )
