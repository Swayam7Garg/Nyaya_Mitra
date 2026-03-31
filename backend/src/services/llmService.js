const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// ─── LangChain model for single-shot calls ─────────────────────────────────
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.2,
  maxOutputTokens: 2048,
});

// ─── System prompt for rights explainer ────────────────────────────────────
const SYSTEM_PROMPT_EXPLAIN = `
You are NyayaSaathi, a legal literacy assistant for first-generation litigants in India.
Your job is to explain legal rights in simple, accessible language.

CRITICAL RULES:
1. ONLY use information from the law sections provided below. Do not add, invent, or 
   extrapolate any legal information not present in the provided text.
2. Never give legal advice. Explain rights and procedures only.
3. Write at a Class 8 reading level. Use short sentences.
4. Use empowering language: "You have the right to...", "The law protects you..."
5. If language is "hi", respond ENTIRELY in Hindi using Devanagari script.
   If language is "en", respond in simple English.
6. Return ONLY valid JSON matching the schema below. No markdown, no preamble.
7. Always include the disclaimer in your response.

OUTPUT SCHEMA (return exactly this JSON structure):
{
  "summary": "one sentence overview of what the law protects",
  "rights": ["right 1", "right 2", "right 3", "right 4"],
  "key_protection": "the single most important protection",
  "what_you_can_do": ["action 1", "action 2", "action 3"],
  "disclaimer": "यह कानूनी जानकारी है, कानूनी सलाह नहीं। / This is legal information, not legal advice."
}
`;

const explainRights = async (situation, lang = "en") => {
  try {
    let lawText = situation.laws.map(l => `Act: ${l.act}\nSection: ${l.section}\nSummary: ${lang === "en" ? l.summary.en : l.summary.hi}\nFull Text: ${l.fullText}`).join("\n\n");
    
    const messages = [
      new SystemMessage(SYSTEM_PROMPT_EXPLAIN),
      new HumanMessage(`Law Sections:\n${lawText}\n\nLanguage: ${lang}\n\nPlease explain my rights regarding: ${lang === "en" ? situation.title.en : situation.title.hi}`)
    ];

    const response = await model.invoke(messages);
    return JSON.parse(response.content);
  } catch (error) {
    console.error("LLM Error (explainRights):", error);
    throw error;
  }
};

// ─── Case Analysis (single-shot) ───────────────────────────────────────────
const analyzeCase = async (situation, userStory, lang = "en") => {
    const CASE_ANALYSIS_PROMPT = `
    You are NyayaSaathi. Analyze the user's situation and provide guidance.
    
    CRITICAL RULES:
    1. Do not give direct legal advice.
    2. Guide them on whether filing a case is appropriate based on the law.
    3. Suggest if settlement is a better option for small issues.
    4. Mention potential complications if they are in the wrong.
    5. Write in simple language (Class 8 level).
    6. Return ONLY valid JSON.
    
    OUTPUT SCHEMA:
    {
        "analysis": "2-3 sentences explaining the legal standing",
        "should_file": "Yes/No/Maybe and Why",
        "is_wrongdoing_possible": "Warning if the user's action might be problematic",
        "settlement_advice": "Should they settle? Why?",
        "charges_possible": "Explain what charges they can potentially file",
        "people_power": "Explain how they can use their collective voice or public support (if applicable)",
        "disclaimer": "This is legal information, not legal advice."
    }
    `;

    try {
        let lawText = situation.laws.map(l => `Act: ${l.act}\nSection: ${l.section}`).join("\n\n");
        const messages = [
          new SystemMessage(CASE_ANALYSIS_PROMPT),
          new HumanMessage(`Situation: ${lang === "en" ? situation.title.en : situation.title.hi}\nUser Story: ${userStory}\nApplicable Law:\n${lawText}\nLanguage: ${lang}`)
        ];
    
        const response = await model.invoke(messages);
        return JSON.parse(response.content);
    } catch (error) {
        console.error("LLM Error (analyzeCase):", error);
        throw error;
    }
};

// ─── Build system prompt with situation context ─────────────────────────────
const buildChatSystemPrompt = (situation, lang) => {
  const title = lang === "hi"
    ? (situation.title && situation.title.hi) || "सामान्य कानूनी प्रश्न"
    : (situation.title && situation.title.en) || "General Legal Query";

  const laws = (situation.laws || []).map(l =>
    `${l.act} - ${l.section}: ${lang === "hi" ? (l.summary && l.summary.hi) : (l.summary && l.summary.en)}`
  ).join("\n") || "No specific laws available.";

  const steps = (situation.steps || []).map((s, i) => {
    const text = lang === "hi"
      ? (s.description && s.description.hi) || (s.title && s.title.hi)
      : (s.description && s.description.en) || (s.title && s.title.en);
    return `${i + 1}. ${text}`;
  }).join("\n") || "No specific steps available.";

  const checklist = (situation.checklist || []).map(c => {
    const text = lang === "hi"
      ? (c.item && c.item.hi)
      : (c.item && c.item.en);
    return `- ${text}`;
  }).join("\n") || "No specific documents listed.";

  const rights = (situation.rights || []).map(r => {
    const text = lang === "hi"
      ? (r.description && r.description.hi) || (r.title && r.title.hi)
      : (r.description && r.description.en) || (r.title && r.title.en);
    return `• ${text}`;
  }).join("\n") || "No specific rights information available.";

  return `You are NyayaSaathi (न्यायसाथी), a friendly legal literacy assistant for first-generation litigants in India.
The user has selected the legal situation: "${title}".

YOUR KNOWLEDGE BASE FOR THIS CONVERSATION:

APPLICABLE LAWS:
${laws}

YOUR RIGHTS IN THIS SITUATION:
${rights}

STEP-BY-STEP PROCEDURE:
${steps}

DOCUMENTS YOU NEED:
${checklist}

STRICT RULES:
1. ONLY use information from the laws, rights, procedure, and documents above.
2. NEVER give specific legal advice. Explain rights and available options only.
3. Speak at Class 8 reading level. Be warm, empathetic, supportive, and clear.
4. ${lang === "hi" ? "ALWAYS respond in Hindi using Devanagari script. Do not mix English words unnecessarily." : "Respond in clear, simple English."}
5. When giving legal guidance, always end with a brief disclaimer.
6. Reference specific law sections when relevant (e.g., "Transfer of Property Act, Section 106 के अनुसार..." or "Under POSH Act Section 4...").
7. Keep responses focused and concise — 3-5 sentences unless the user asks for more detail.
8. If the user asks something outside your knowledge base, politely say you only have information about ${title}.
9. Always be encouraging — remind users that legal aid is their right and free legal help is available.`;
};

// ─── Multi-turn Gemini Chat ────────────────────────────────────────────────
const chatWithGemini = async (situation, messages, lang = "en") => {
  try {
    const systemContext = buildChatSystemPrompt(situation, lang);

    // All messages except the last become history
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Gemini requires the first history message to be from 'user'
    if (history.length > 0 && history[0].role === "model") {
      history.unshift({
        role: "user",
        parts: [{ text: lang === "hi" ? "नमस्ते, मुझे एक कानूनी सवाल पूछना है।" : "Hi, I have a legal query." }]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemContext,
    });

    const chat = geminiModel.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  } catch (error) {
    console.error("LLM Error (chatWithGemini):", error);
    throw error;
  }
};

module.exports = {
  explainRights,
  analyzeCase,
  chatWithGemini,
};
