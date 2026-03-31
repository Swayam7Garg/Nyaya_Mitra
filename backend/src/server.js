require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const situationRoutes = require("./routes/situations");
const aiRoutes = require("./routes/ai");
const lawyerRoutes = require("./routes/lawyers");
const documentRoutes = require("./routes/documents");

const app = express();

// Connect to database
connectDB();

// Core middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/situations", situationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/documents", documentRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
