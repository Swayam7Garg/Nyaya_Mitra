# NyayaSaathi — Improvement Plan
## Chat System (Gemini-Only) + OpenAI Removal + Missing Features

---

## 📊 Current State Analysis

### ✅ What Is Already Implemented

| Feature | Location | Status |
|---|---|---|
| Legal Situation Selector | `frontend/app/situations/` | ✅ Done |
| 7+ Situation Categories (static data) | `frontend/data/situations.ts` | ✅ Done (7 situations) |
| Plain-language Rights Explainer (Dual Display) | `components/situations/DualDisplayPanel.tsx` | ✅ Done |
| Document Checklist | `components/situations/DocumentChecklist.tsx` | ✅ Done |
| Step-by-step Procedure Guide | `components/situations/ProcedureStepper.tsx` | ✅ Done |
| Lawyer Directory (static) | `frontend/data/lawyers.json` | ✅ Done (static) |
| Document Template Generator (jsPDF) | `frontend/lib/pdfGenerator.ts` | ✅ Done |
| Bilingual Support (Hindi/English) | `frontend/locales/` + i18next | ✅ Done |
| LLM Backend (Gemini Flash) | `backend/src/services/llmService.js` | ✅ Done — Gemini, not OpenAI! |
| Case Analysis AI endpoint | `backend/src/routes/ai.js` | ✅ Done |
| AI Chatbox (one-shot analysis) | `components/situations/AIChatbox.tsx` | ⚠️ Done but NOT a real chat |
| About Page | `frontend/app/about/page.tsx` | ⚠️ Has stale OpenAI reference |

---

### ❌ What Is NOT Implemented / Missing

| Feature | Priority | Notes |
|---|---|---|
| **Real multi-turn Chat System (Gemini)** | 🔴 HIGH | Current `AIChatbox` is a single-shot form, not a chat |
| **Chat history / memory** | 🔴 HIGH | No conversation state carried between messages |
| **Unused `createAgent.ts` cleanup** | 🔴 HIGH | Dead code using LangChain agents, never imported |
| **MongoDB live connection verified** | 🟡 MEDIUM | Seed data exists, but DB may not be live |
| **Lawyer directory - verified 10+ entries** | 🟡 MEDIUM | Need to audit coverage across all specializations |
| **FIR document template** | 🟡 MEDIUM | RTI and Consumer Complaint exist, FIR draft missing |
| **RTI + Complaint templates tested end-to-end** | 🟡 MEDIUM | Logic exists but untested |
| **Loading/skeleton states** | 🟢 LOW | Basic loading only |
| **Error boundary / offline fallback** | 🟢 LOW | Minimal error handling |

---

### 🐛 OpenAI References to Remove

| File | Line | Issue | Fix |
|---|---|---|---|
| `README.md` | L36 | `LLM[OpenAI GPT-4o API]` in mermaid diagram | → `LLM[Google Gemini 1.5 Flash API]` |
| `README.md` | L135 | `OPENAI_API_KEY=sk-xxx` in env docs | → `GEMINI_API_KEY=AIzaSy...` |
| `todo.md` | L5-6 | "OpenAI API" and `OPENAI_API_KEY` | → Update to Gemini |
| `frontend/app/about/page.tsx` | L5 | `'OpenAI API (GPT-4o)'` in techStack array | → `'Google Gemini Flash (AI)'` |
| `frontend/scripts/batch7.cjs` | L513 | Same stale OpenAI string | → Update to Gemini |
| `frontend/lib/createAgent.ts` | all | LangChain agent boilerplate — never imported | → **DELETE this file** |
| `frontend/package.json` | deps | `langchain`, `@langchain/google`, `@langchain/google-genai`, `@langchain/core` unused | → Remove; add `@google/generative-ai` |

> **Key clarification:** The backend `llmService.js` already uses Gemini correctly via `@langchain/google-genai`. The backend is fine. Only the **frontend** has stale OpenAI references and unused LangChain packages.

---

## 🗺️ Architecture After All Changes

```
Browser (Next.js 14)
  │
  ├── /situations        → Situation Selector + Rights + Checklist + Procedure
  │     └── GeminiChat   ←── NEW: Real multi-turn Gemini chat bubbles
  │
  ├── /lawyers           → Lawyer directory with filter
  ├── /generate          → Document template generator (PDF download)
  └── /api/              → Next.js API proxy routes
        ├── /chat         ←── NEW: Multi-turn chat proxy (Gemini)
        ├── /explain      → Single-call rights explainer
        ├── /analyze      → One-shot case analysis
        └── /generate-document → Document fill via backend

Node.js + Express Backend
  ├── /api/ai/explain-rights  → Gemini Flash (done ✅)
  ├── /api/ai/analyze-case    → Gemini Flash (done ✅)
  ├── /api/ai/chat            ←── NEW: Chat with history
  ├── /api/situations         → MongoDB / seed data
  ├── /api/lawyers            → MongoDB / seed data
  └── /api/documents/generate → Template fill

Google Gemini 1.5 Flash API  ← ONLY LLM (NO OpenAI, NO RAG, NO vector DB)
MongoDB Atlas (situations + lawyers data)
```

---

## 🤖 Phase 1 — OpenAI Purge (~30 min)

### 1.1 `frontend/app/about/page.tsx` — Line 5
```diff
- const techStack = [..., 'OpenAI API (GPT-4o)'];
+ const techStack = [..., 'Google Gemini Flash (AI)'];
```

### 1.2 `README.md`
```diff
- LLM[OpenAI GPT-4o API]
+ LLM[Google Gemini 1.5 Flash API]

- OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
+ GEMINI_API_KEY=AIzaSy...
```

### 1.3 `todo.md` — Replace item 1
```diff
- 1. **Backend LLM Integration (OpenAI API):**
-    ...requires a valid `OPENAI_API_KEY` in your `backend/.env` file...
+ 1. **Chat System & LLM (Gemini API):**
+    All AI features require a valid `GEMINI_API_KEY` in your `backend/.env` file.
+    The multi-turn chat system needs the `/api/ai/chat` backend endpoint to be running.
```

### 1.4 DELETE `frontend/lib/createAgent.ts`
This file is never imported anywhere. It is dead LangChain agent boilerplate.

### 1.5 `frontend/package.json`
```diff
  "dependencies": {
-   "@langchain/core": "^1.1.38",
-   "@langchain/google": "^0.1.9",
-   "@langchain/google-genai": "^2.1.26",
-   "langchain": "^1.2.39",
+   "@google/generative-ai": "^0.21.0",
    "axios": "^1.14.0",
    ...
  }
```
Then run: `cd frontend && npm install`

---

## 💬 Phase 2 — Multi-Turn Gemini Chat System (~2-3 hrs)

> **Goal:** Replace the single-shot `AIChatbox.tsx` (form → one response) with a WhatsApp-style multi-turn chat that uses Gemini's native history support.

### 2.1 Backend — `@google/generative-ai` for Native Multi-Turn

```bash
cd backend && npm install @google/generative-ai
```

### 2.2 Backend — Add `chatWithGemini()` to `llmService.js`

Add these two functions and update the exports:

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildChatSystemPrompt = (situation, lang) => {
  const title = lang === 'hi' ? situation.title?.hi : situation.title?.en;
  const laws = (situation.laws || []).map(l =>
    `${l.act} - Section ${l.section}: ${lang === 'hi' ? l.summary?.hi : l.summary?.en}`
  ).join('\n');
  const steps = (situation.steps || []).map((s, i) =>
    `${i+1}. ${lang === 'hi' ? s.hi : s.en}`
  ).join('\n');
  const checklist = (situation.checklist || []).map(c =>
    `- ${lang === 'hi' ? c.hi : c.en}`
  ).join('\n');

  return `You are NyayaSaathi, a legal literacy assistant for first-generation litigants in India.
The user has selected the situation: "${title || 'General Legal Query'}".

RELEVANT LAWS:
${laws || 'No specific laws provided.'}

STEP-BY-STEP PROCEDURE:
${steps || 'No specific procedure provided.'}

REQUIRED DOCUMENTS:
${checklist || 'No specific documents listed.'}

RULES:
1. ONLY use information from the laws, procedure, and documents above.
2. Never give specific legal advice. Explain rights and options only.
3. Speak at Class 8 reading level. Be warm, supportive, clear.
4. ${lang === 'hi' ? 'Always respond in Hindi using Devanagari script.' : 'Respond in simple English.'}
5. If giving legal guidance, end with a brief disclaimer.
6. Reference specific sections when relevant (e.g., "Under Section 12 of the POSH Act...").
7. Keep responses concise — 3-5 sentences unless the user asks for more detail.`;
};

const chatWithGemini = async (situation, messages, lang = 'en') => {
  const systemContext = buildChatSystemPrompt(situation, lang);

  // All messages except the last one become the history
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemContext,
  });

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
};

// Update exports:
module.exports = { explainRights, analyzeCase, chatWithGemini };
```

### 2.3 Backend — Add `POST /chat` to `ai.js`

Add at the top:
```javascript
const { explainRights, analyzeCase, chatWithGemini } = require('../services/llmService');
```

Add the route:
```javascript
// POST /api/ai/chat
// Body: { situationId, messages: [{role: 'user'|'assistant', content: string}], lang }
router.post('/chat', async (req, res, next) => {
  try {
    const { situationId, messages, lang } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }
    // Situation context is optional — chat works even without it
    const situation = await Situation.findOne({ id: situationId }) || {};
    const reply = await chatWithGemini(situation, messages, lang || 'en');
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});
```

### 2.4 Frontend — Create `frontend/app/api/chat/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { situationId, messages, lang } = await req.json();
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situationId, messages, lang }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Chat service unavailable. Please try again.' },
      { status: 503 }
    );
  }
}
```

### 2.5 Frontend — Create `GeminiChat.tsx`

Create `frontend/components/situations/GeminiChat.tsx`:

**UX Design:**
- Chat bubble layout: user messages align RIGHT (blue bg), AI messages align LEFT (white + blue left border)
- Animated typing indicator (3 bouncing dots) while waiting for Gemini
- Auto-scroll to latest message via `useRef` + `useEffect`
- Situation-specific greeting pre-loaded on mount
- `Enter` key sends, `Shift+Enter` inserts newline
- "Clear conversation" button in header
- Character counter on textarea (max 500)
- Disclaimer footer pinned at bottom: "This is legal information, not legal advice."
- Hindi/English switching via `i18n.language`

**TypeScript interfaces:**
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface GeminiChatProps {
  situation: Situation;
}
```

**Greeting helper:**
```typescript
const getGreeting = (situation: Situation, isHi: boolean): string => {
  const title = isHi ? situation.title?.hi : situation.title?.en;
  return isHi
    ? `नमस्ते! मैं न्यायसाथी हूँ। आपने "${title}" की स्थिति चुनी है। मैं आपको इस विषय में आपके अधिकार और प्रक्रिया समझाऊंगा। आप मुझसे कोई भी प्रश्न पूछ सकते हैं।`
    : `Hello! I'm NyayaSaathi, your legal literacy assistant. You've selected "${title}". I'm here to explain your rights and guide you step by step. What would you like to know?`;
};
```

**Send message handler:**
```typescript
const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
  const updatedMessages = [...messages, userMsg];
  setMessages(updatedMessages);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situationId: situation.id,
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        lang: isHi ? 'hi' : 'en'
      })
    });
    const data = await res.json();
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.reply || (isHi ? 'माफ़ कीजिए, अभी सेवा उपलब्ध नहीं है।' : 'Sorry, the service is unavailable.'),
      timestamp: new Date(),
      isError: !!data.error
    }]);
  } catch {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: isHi ? 'कनेक्शन में समस्या है। कृपया पुनः प्रयास करें।' : 'Connection error. Please try again.',
      timestamp: new Date(),
      isError: true
    }]);
  } finally {
    setLoading(false);
  }
};
```

### 2.6 Wire into Situations Detail Page

In `frontend/app/situations/[slug]/page.tsx`:
```diff
- import AIChatbox from '../../../components/situations/AIChatbox';
+ import GeminiChat from '../../../components/situations/GeminiChat';

- <AIChatbox situation={situation} />
+ <GeminiChat situation={situation} />
```

---

## 📋 Phase 3 — Missing Deliverable Features (~1-2 hrs)

### 3.1 Audit All 7 Situation Data Objects

**File:** `frontend/data/situations.ts`

Each situation must have ALL of the following fields:
- [ ] `id` (unique string)
- [ ] `slug` (URL-safe)
- [ ] `category` (display name)
- [ ] `title: { en: string, hi: string }`
- [ ] `description: { en: string, hi: string }`
- [ ] `rights: Array<{ en: string, hi: string }>` — minimum 3
- [ ] `laws: Array<{ act, section, summary: { en, hi }, fullText }>` — minimum 2
- [ ] `checklist: Array<{ en, hi, category? }>` — minimum 5 items
- [ ] `steps: Array<{ en: string, hi: string }>` — minimum 4 steps
- [ ] `templateType: 'rti' | 'consumer_complaint' | 'fir' | 'generic'`

**Minimum 6 required categories:**
1. Landlord Dispute
2. Consumer Complaint
3. Workplace Harassment (POSH Act 2013)
4. FIR Filing
5. RTI Application
6. Domestic Violence (PWDVA 2005)
7. Labor Rights / Wage Theft

### 3.2 Add FIR Draft Template to `pdfGenerator.ts`

Add `generateFIRDraft(fields)` function:

**Input fields:**
```typescript
{
  policeStationName: string;
  policeStationAddress: string;
  complainantName: string;
  complainantAddress: string;
  complainantPhone: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  accusedNames?: string;
  witnessNames?: string;
  evidenceList?: string;
}
```

**PDF structure:**
```
TO,
The Station House Officer
[policeStationName]
[policeStationAddress]

SUBJECT: Complaint for registration of FIR under CrPC Section 154

Sir/Ma'am,

I, [complainantName], residing at [complainantAddress],
contact: [complainantPhone], hereby submit this complaint:

DATE & TIME OF INCIDENT: [incidentDate] at [incidentTime]
PLACE OF INCIDENT: [incidentLocation]

DETAILS:
[incidentDescription]

ACCUSED (if known): [accusedNames]
WITNESSES (if any): [witnessNames]
EVIDENCE: [evidenceList]

I request you to register an FIR and take necessary legal action.

Place: _______    Date: _______    Signature: _______
                                   [complainantName]

[DISCLAIMER: This is a draft complaint. Consult a lawyer before filing.]
```

### 3.3 Audit Lawyer Directory

**File:** `frontend/data/lawyers.json`

Verify:
- [ ] Minimum **10 lawyers** total
- [ ] At least 1 lawyer per specialization:
  - `landlord_dispute` / `tenant_rights`
  - `consumer_protection`
  - `workplace_harassment` / `posh`
  - `criminal` / `fir`
  - `rti`
  - `domestic_violence`
  - `labor_rights`
- [ ] Lawyers span at least **5 states**: Delhi, Maharashtra, Karnataka, Tamil Nadu, West Bengal
- [ ] All entries have `proBono: true` or `proBono: false` field
- [ ] All entries have `rating` (1.0–5.0), `experience` (years), `barCouncilId`

---

## 🔧 Phase 4 — ENV Documentation (~15 min)

### `backend/.env` (final correct state)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/legalaid?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSy...
FRONTEND_URL=http://localhost:3000
```

### `frontend/.env.local` (final correct state)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> The frontend does NOT need `GEMINI_API_KEY` directly — all AI calls go through the backend. This is the correct security pattern.

---

## 📁 Complete File Change Summary

### DELETE
| File | Reason |
|---|---|
| `frontend/lib/createAgent.ts` | Dead code — never imported, unused LangChain agent boilerplate |

### CREATE
| File | Purpose |
|---|---|
| `frontend/app/api/chat/route.ts` | Next.js proxy for Gemini multi-turn chat |
| `frontend/components/situations/GeminiChat.tsx` | Chat bubble UI component |

### MODIFY
| File | Change |
|---|---|
| `frontend/app/about/page.tsx` | `'OpenAI API (GPT-4o)'` → `'Google Gemini Flash (AI)'` |
| `frontend/package.json` | Remove `langchain`/`@langchain/*`; add `@google/generative-ai` |
| `backend/package.json` | Add `@google/generative-ai` for direct SDK |
| `backend/src/services/llmService.js` | Add `chatWithGemini()` + `buildChatSystemPrompt()` |
| `backend/src/routes/ai.js` | Add `POST /api/ai/chat` endpoint |
| `frontend/app/situations/[slug]/page.tsx` | Replace `AIChatbox` → `GeminiChat` |
| `README.md` | All OpenAI→Gemini references + env docs |
| `todo.md` | Update limitations section |
| `frontend/lib/pdfGenerator.ts` | Add `generateFIRDraft()` function |
| `frontend/data/lawyers.json` | Audit/add to get 10+ lawyers covering all specializations |
| `frontend/data/situations.ts` | Verify all 7 situations have complete required fields |

---

## ✅ Final Deliverables Checklist

| Hackathon Deliverable | Status |
|---|---|
| Legal situation selector with 6+ categories | ✅ 7 categories (needs data audit) |
| Plain-language rights explainer per situation | ✅ DualDisplayPanel working |
| Relevant law section summariser (LLM-powered) | ✅ Gemini Flash via backend |
| Document checklist generator | ✅ DocumentChecklist component |
| Step-by-step procedure guide | ✅ ProcedureStepper component |
| Legal aid lawyer directory | ✅ Static + filters (needs 10+ audit) |
| Document template generator (RTI, complaint letters) | ✅ + FIR draft (Phase 3.2) |
| **Multi-turn AI Chat (Gemini)** | 🔨 Build in Phase 2 |

---

## 🚀 Build Order

```
Phase 1 (~30 min):  OpenAI Purge
  1. Edit frontend/app/about/page.tsx
  2. Edit README.md (2 lines)
  3. Edit todo.md
  4. Delete frontend/lib/createAgent.ts
  5. Edit frontend/package.json → npm install

Phase 2 (~2-3 hrs): Gemini Chat System  ← BIGGEST WIN
  1. npm install @google/generative-ai in backend/
  2. Add chatWithGemini() to llmService.js
  3. Add POST /chat route to ai.js
  4. Create frontend/app/api/chat/route.ts
  5. Create frontend/components/situations/GeminiChat.tsx
  6. Wire GeminiChat into situations/[slug]/page.tsx

Phase 3 (~1-2 hrs): Data & Template Completeness
  1. Audit + fix situations.ts (all 7 situations complete)
  2. Add generateFIRDraft() to pdfGenerator.ts
  3. Audit + fill lawyers.json (10+ entries, all specializations)

Phase 4 (~15 min): Docs & ENV
  1. Final README.md polish
  2. Update todo.md
  3. Add backend/.env.example
```

---

*Created: 2026-04-01 | NyayaSaathi Legal Aid Platform | Gemini Flash only — no RAG, no OpenAI*
