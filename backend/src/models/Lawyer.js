const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specializations: [{ type: String }],
    state: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String },
    languages: [{ type: String }],
    proBono: { type: Boolean, default: true },
    experience: { type: Number },
    barCouncilId: { type: String, required: true, unique: true },
    availableFor: [{ type: String }],
    rating: { type: Number, default: 5 },
    locationLink: { type: String }, // Google Maps link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lawyer", lawyerSchema);
