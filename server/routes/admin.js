import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Feedback from "../models/Feedback.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware, requireRole("admin"));

router.get("/stats", async (_req, res) => {
  const [users, students, owners, bookings, pending, accepted, rejected] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "owner" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "accepted" }),
      Booking.countDocuments({ status: "rejected" }),
    ]);
  res.json({
    users,
    students,
    owners,
    bookings,
    pending,
    accepted,
    rejected,
  });
});

router.get("/bookings", async (_req, res) => {
  const list = await Booking.find()
    .populate("student", "name email")
    .populate("owner", "name email")
    .sort({ createdAt: -1 });
  res.json(list);
});

router.get("/users", async (_req, res) => {
  const list = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
  res.json(list);
});

router.get("/feedback", async (_req, res) => {
  const list = await Feedback.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
  res.json(list);
});

export default router;
