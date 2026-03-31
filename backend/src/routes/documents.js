const express = require("express");
const router = express.Router();
const Situation = require("../models/Situation");

// GET /api/documents/template/:id - returns template info for a situation
router.get("/template/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const situation = await Situation.findOne({ id });
        if (!situation) {
            return res.status(404).json({ error: "Situation not found" });
        }

        // Logic to return template based on templateType
        let template = {
            title: situation.title,
            type: situation.templateType,
            required_docs: situation.checklist.filter(c => c.required).map(c => c.item),
            optional_docs: situation.checklist.filter(c => !c.required).map(c => c.item),
        };

        if (situation.templateType === "rti") {
            template.description = {
                en: "Right to Information (RTI) application template.",
                hi: "सूचना का अधिकार (RTI) आवेदन पत्र।"
            };
        } else if (situation.templateType === "complaint") {
            template.description = {
                en: "Standard legal complaint or representation letter.",
                hi: "मानक कानूनी शिकायत या पत्र।"
            };
        }

        res.json(template);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
