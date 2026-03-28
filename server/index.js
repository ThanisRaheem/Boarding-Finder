import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/auth.js";
import boardingRoutes from "./routes/boarding.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import feedbackRoutes from "./routes/feedback.js";
import User from "./models/User.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/boarding", boardingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

io.use((socket, next) => {
  const userId = socket.handshake.auth?.userId;
  if (!userId) return next(new Error("Unauthorized"));
  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.userId}`);
  socket.on("join:booking", (bookingId) => {
    if (bookingId) socket.join(`booking:${bookingId}`);
  });
  socket.on("leave:booking", (bookingId) => {
    if (bookingId) socket.leave(`booking:${bookingId}`);
  });
});

async function ensureDefaults() {
  const admin = await User.findOne({ email: "admin@gmail.com" });
  if (!admin) {
    const hashed = await bcrypt.hash("Abc123", 10);
    await User.create({
      name: "Campus Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
    });
    console.log("Created default admin: admin@gmail.com / Abc123");
  }

  const mainOwner = await User.findOne({ email: "owner@gmail.com" });
  if (!mainOwner) {
    const ownerHash = await bcrypt.hash("Abc123", 10);
    await User.create({
      name: "Campus Owner",
      email: "owner@gmail.com",
      password: ownerHash,
      role: "owner",
    });
    console.log("Created default owner: owner@gmail.com / Abc123");
  }
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/boarding_finder")
  .then(async () => {
    await ensureDefaults();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
