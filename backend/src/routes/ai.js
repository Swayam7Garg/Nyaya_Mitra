const express = require("express");
const router = express.Router();
const Situation = require("../models/Situation");
const { explainRights, analyzeCase, chatWithGemini } = require("../services/llmService");

// POST /api/ai/explain-rights — Given a situation ID, return LLM-powered explanation
router.post("/explain-rights", async (req, res, next) => {
    try {
        const { id, lang } = req.body;
        const situation = await Situation.findOne({ id });
        if (!situation) {
            return res.status(404).json({ error: "Situation not found" });
        }

        const explanation = await explainRights(situation, lang || "en");
        res.json(explanation);
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/analyze-case — Given context and user story, analyze legal position
router.post("/analyze-case", async (req, res, next) => {
    try {
        const { id, userStory, lang } = req.body;
        const situation = await Situation.findOne({ id });
        if (!situation) {
            return res.status(404).json({ error: "Situation not found" });
        }

        const analysis = await analyzeCase(situation, userStory, lang || "en");
        res.json(analysis);
    } catch (err) {
        next(err);
    }
});

// POST /api/ai/chat — Multi-turn Gemini chat with situation context
// Body: { situationId, messages: [{role: 'user'|'assistant', content: string}], lang }
router.post("/chat", async (req, res, next) => {
    try {
        const { situationId, messages, lang } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "No messages provided. Please send at least one message." });
        }

        // Validate last message is from user
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== "user") {
            return res.status(400).json({ error: "Last message must be from user." });
        }

        // Situation context is optional — chat works without it (general legal queries)
        let situation = {};
        if (situationId) {
            const found = await Situation.findOne({ id: situationId });
            if (found) situation = found;
        }

        const reply = await chatWithGemini(situation, messages, lang || "en");
        res.json({ reply, situationId: situationId || null });
    } catch (err) {
        console.error("Chat endpoint error:", err);
        // Return a friendly error instead of crashing
        res.status(503).json({
            error: "AI service temporarily unavailable. Please try again in a moment.",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
});

module.exports = router;
