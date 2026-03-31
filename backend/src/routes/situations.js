const express = require("express");
const router = express.Router();
const Situation = require("../models/Situation");
const situationsData = require("../data/situations");

// Seed helper (called on first request if DB empty)
let seeded = false;
const seedIfEmpty = async () => {
  if (seeded) return;
  const count = await Situation.countDocuments();
  if (count === 0) {
    await Situation.insertMany(situationsData);
    console.log("Situations seeded.");
  }
  seeded = true;
};

// GET /api/situations — get all situations (summary)
router.get("/", async (req, res, next) => {
  try {
    await seedIfEmpty();
    const situations = await Situation.find(
      {},
      "id category icon title description templateType"
    );
    res.json(situations);
  } catch (err) {
    next(err);
  }
});

// GET /api/situations/:id — get full situation detail
router.get("/:id", async (req, res, next) => {
  try {
    await seedIfEmpty();
    const situation = await Situation.findOne({ id: req.params.id });
    if (!situation) {
      return res.status(404).json({ error: "Situation not found" });
    }
    res.json(situation);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
