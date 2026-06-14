"""
services/embedding_service.py
------------------------------
Wraps the Google Gemini embedding model via the google.genai SDK.

Provides a single public function:
    embed_chunks(chunks) -> list[list[float]]

The task_type is set to "RETRIEVAL_DOCUMENT" for ingestion so that the
vectors are tuned for document-side retrieval (the query side will use
"RETRIEVAL_QUERY" in the RAG/search phase).
"""

import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if api_key:
            api_key = api_key.strip()
        if not api_key:
            raise EnvironmentError(
                "GOOGLE_API_KEY or GEMINI_API_KEY must be set in the environment."
            )
        _client = genai.Client(api_key=api_key)
    return _client


def embed_chunks(chunks: list[dict]) -> list[list[float]]:
    """
    Generates embeddings in batch using the Gemini embedding model.
    """
    client = _get_client()
    vectors = []
    
    # Process in batches of 100 chunks to prevent hitting API payload size limits
    batch_size = 100
    chunk_texts = [c["text"] for c in chunks]
    
    for i in range(0, len(chunk_texts), batch_size):
        batch = chunk_texts[i:i + batch_size]
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=batch,
            config={
                "task_type": "RETRIEVAL_DOCUMENT",
                "output_dimensionality": 768,
            },
        )
        for emb in result.embeddings:
            vectors.append(emb.values)

    print("Chunks:", len(chunks))
    print("Vectors:", len(vectors))

    return vectors