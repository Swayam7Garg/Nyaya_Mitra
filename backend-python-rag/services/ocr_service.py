import pdfplumber
import pypdf
import io
import os
import re
import sys

# ── Tesseract configuration ──────────────────────────────────────────────────
# On Windows, set the path explicitly. On Linux (Render, Docker), tesseract
# should be in PATH if installed via apt. If not installed, OCR is skipped.
if sys.platform == "win32":
    import pytesseract
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )
    _TESSERACT_AVAILABLE = True
else:
    try:
        import pytesseract
        # Verify tesseract is actually installed on Linux
        pytesseract.get_tesseract_version()
        _TESSERACT_AVAILABLE = True
    except Exception:
        _TESSERACT_AVAILABLE = False
        print("[WARNING] Tesseract OCR is not available. Scanned PDFs cannot be processed.")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF. Uses multiple strategies:
    1. pypdf (fast, handles most native-text PDFs)
    2. pdfplumber (better table/layout extraction)
    3. Tesseract OCR fallback (for scanned PDFs, if available)
    """
    if not file_bytes or len(file_bytes) < 10:
        raise ValueError("The uploaded PDF file is empty or corrupted.")

    # Find the start of the PDF header (handles leading junk bytes)
    pdf_start = file_bytes.find(b"%PDF-")
    if pdf_start == -1:
        raise ValueError("Invalid PDF format: Missing %PDF- header signature.")

    if pdf_start > 0:
        file_bytes = file_bytes[pdf_start:]

    text = ""

    # ── Strategy 1: Try pypdf first (most robust for well-formed PDFs) ────────
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if text.strip() and len(text.strip()) > 50:
            print(f"[INFO] Text extracted via pypdf: {len(text)} chars")
            return clean_text(text)
    except Exception as e:
        print(f"[WARNING] pypdf extraction failed: {e}. Trying pdfplumber...")

    # ── Strategy 2: Try pdfplumber (better for complex layouts) ───────────────
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text and len(page_text.strip()) >= 20:
                    text += page_text + "\n"
                elif _TESSERACT_AVAILABLE:
                    # ── Strategy 3: OCR fallback for scanned pages ────────────
                    try:
                        im = page.to_image(resolution=300).original
                        # Try eng+hin first, fall back to eng only
                        try:
                            page_text = pytesseract.image_to_string(im, lang="eng+hin")
                        except Exception:
                            page_text = pytesseract.image_to_string(im, lang="eng")
                        if page_text:
                            text += page_text + "\n"
                    except Exception as e:
                        print(f"[WARNING] OCR failed for a page: {e}")
                        continue

        if text.strip():
            print(f"[INFO] Text extracted via pdfplumber: {len(text)} chars")
            return clean_text(text)
    except Exception as e:
        print(f"[WARNING] pdfplumber extraction failed: {e}")

    # ── All strategies failed ─────────────────────────────────────────────────
    if not text.strip():
        raise Exception(
            "Failed to extract text from PDF. The file may be corrupted, "
            "password-protected, or contain only images without OCR support."
        )

    return clean_text(text)


def clean_text(text: str) -> str:
    """
    Cleans up the extracted text by removing excessive whitespace
    and malformed line breaks often found in PDFs.
    """
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)
    # Replace multiple spaces with a single space
    text = re.sub(r' +', ' ', text)
    return text.strip()
