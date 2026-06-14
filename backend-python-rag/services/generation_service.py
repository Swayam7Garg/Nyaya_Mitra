"""
services/generation_service.py
-------------------------------
Wraps Gemini 1.5 Flash to generate grounded, cited legal answers
from retrieved ChromaDB context chunks.
"""

import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini once at module level
_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None

_model = None


def _get_model_name():
    return "gemini-2.5-flash"


SYSTEM_PROMPT_TEMPLATE = """You are NyayaMitra, a compassionate and knowledgeable legal assistant for India's first-time litigants.

Your role is to:
1. Answer questions clearly and simply, avoiding complex legal jargon.
2. Always ground your answer in the provided CONTEXT from legal documents.
3. If the answer is found in the context, cite the source title and URL in a "Sources" section.
4. If the context doesn't have enough information, say so honestly — do NOT hallucinate.
5. CRITICAL — Language Rule: You MUST respond ONLY in {language_instruction}. Do NOT switch languages even if the query or documents are in another language.
6. Always end by advising the user to consult a qualified lawyer for their specific situation.

Format your response as:
- A clear, plain-language answer (2–4 paragraphs)
- A "Sources" section listing the document titles and official URLs you referenced"""


def generate_answer(query: str, context_chunks: list[dict], language: str = "en") -> dict:
    """
    Generate a grounded RAG answer using Gemini Flash.

    Args:
        query: The user's legal question.
        context_chunks: List of dicts with keys: text, filename, chunk_index, score, metadata.
        language: 'en' | 'hi' | 'auto' — controls response language strictly.

    Returns:
        dict with keys: answer (str), sources (list[str])
    """
    # ── Determine language instruction ────────────────────────────────────────
    if language == "hi":
        language_instruction = "Hindi (हिंदी)"
    elif language == "en":
        language_instruction = "English only"
    else:
        # auto: detect from query script — default to English for Latin queries
        has_devanagari = any('\u0900' <= ch <= '\u097F' for ch in query)
        language_instruction = "Hindi (हिंदी)" if has_devanagari else "English only"

    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(language_instruction=language_instruction)

    print(f"\n[DEBUG] [Generation] Query: '{query}' | Language: {language} → {language_instruction}")
    print(f"[DEBUG] [Generation] Chunks used: {len(context_chunks)}")

    if not context_chunks:
        no_docs = (
            "No relevant documents found. Please consult a qualified lawyer."
            if language != "hi" else
            "इस प्रश्न के लिए प्रासंगिक दस्तावेज़ नहीं मिले। किसी योग्य वकील से सलाह लें।"
        )
        return {"answer": no_docs, "sources": []}

    # Build context block — pull real title + source_url from metadata
    context_lines = []
    sources = []
    for i, chunk in enumerate(context_chunks):
        meta = chunk.get("metadata") or {}
        # metadata may be a dict (pgvector) or already parsed
        if isinstance(meta, str):
            import json
            try:
                meta = json.loads(meta)
            except Exception:
                meta = {}
        title = meta.get("title") or meta.get("filename") or chunk.get("filename", "unknown")
        source_url = meta.get("source_url", "")
        label = f"{title}" + (f" ({source_url})" if source_url else "")
        text = chunk.get("text", "")
        context_lines.append(f"[Source {i+1}: {label}]\n{text}")
        source_entry = label if label not in sources else None
        if source_entry:
            sources.append(source_entry)

    context_block = "\n\n---\n\n".join(context_lines)

    prompt = f"""{system_prompt}

CONTEXT:
{context_block}

USER QUESTION:
{query}

ANSWER:"""

    if not _client:
        raise RuntimeError("Gemini API key not configured")
    model_name = _get_model_name()
    response = _client.models.generate_content(
        model=model_name,
        contents=prompt,
    )
    answer_text = response.text.strip()

    return {
        "answer": answer_text,
        "sources": sources,
    }
