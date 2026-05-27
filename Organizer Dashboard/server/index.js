import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import { startEventStatusUpdater } from "./jobs/eventStatusUpdater.js";

// route imports
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── middleware ──────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── error handling ─────────────────────────────────────────────────
app.use(errorHandler);

// ── start server ───────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n  ✦ EventSphere API running on http://localhost:${PORT}`);
    console.log(`  ✦ Environment: ${process.env.NODE_ENV || "development"}\n`);
    startEventStatusUpdater();
  });
};

startServer();
