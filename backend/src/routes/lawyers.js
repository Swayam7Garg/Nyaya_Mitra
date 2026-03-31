const express = require("express");
const router = express.Router();
const Lawyer = require("../models/Lawyer");
const lawyersData = require("../data/lawyers");

// Seed helper (called on first request if DB empty)
let seeded = false;
const seedIfEmpty = async () => {
    if (seeded) return;
    const count = await Lawyer.countDocuments();
    if (count === 0) {
      await Lawyer.insertMany(lawyersData);
      console.log("Lawyers seeded.");
    }
    seeded = true;
};

// GET /api/lawyers — get nearby lawyers (filtered by city or state or specialization)
router.get("/", async (req, res, next) => {
    try {
        await seedIfEmpty();
        const { city, state, specialization } = req.query;
        let query = { proBono: true }; // All lawyers in this directory are pro bono
        
        if (city) query.city = new RegExp(city, 'i');
        if (state) query.state = new RegExp(state, 'i');
        if (specialization) query.availableFor = specialization;

        const lawyers = await Lawyer.find(query);
        res.json(lawyers);
    } catch (err) {
        next(err);
    }
});

// GET /api/lawyers/:city — get lawyers in a specific city
router.get("/city/:city", async (req, res, next) => {
    try {
        await seedIfEmpty();
        const lawyers = await Lawyer.find({ city: new RegExp(req.params.city, 'i') });
        res.json(lawyers);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
