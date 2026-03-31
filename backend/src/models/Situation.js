const mongoose = require("mongoose");

const situationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    icon: { type: String, default: "scale" },
    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    rights: [
      {
        title: { en: String, hi: String },
        description: { en: String, hi: String },
      },
    ],
    laws: [
      {
        section: String,
        act: String,
        summary: { en: String, hi: String },
        fullText: String,
      },
    ],
    checklist: [
      {
        item: { en: String, hi: String },
        required: { type: Boolean, default: true },
      },
    ],
    steps: [
      {
        stepNumber: Number,
        title: { en: String, hi: String },
        description: { en: String, hi: String },
        tip: { en: String, hi: String },
      },
    ],
    templateType: {
      type: String,
      enum: ["rti", "complaint", "both", "none", "fir", "labor"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Situation", situationSchema);
