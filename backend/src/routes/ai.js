const express = require("express");
const router = express.Router();
const Situation = require("../models/Situation");
const { explainRights, analyzeCase } = require("../services/llmService");

// POST /api/ai/explain-rights - Given a situation ID, return LLM-powered explanation
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

// POST /api/ai/analyze-case - Given context and user story, analyze legal position
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

module.exports = router;
