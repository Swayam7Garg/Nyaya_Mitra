const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage, HumanMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.2,
  maxOutputTokens: 2048,
});

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
    // Combine law sections for the prompt
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

const analyzeCase = async (situation, userStory, lang = "en") => {
    // This is for "explain if they are wrong doing the case", "should they settle", "ask whether they should file or not"
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

module.exports = {
  explainRights,
  analyzeCase
};
