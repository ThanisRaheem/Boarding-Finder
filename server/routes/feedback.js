import express from "express";
import Feedback from "../models/Feedback.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/home", async (_req, res) => {
  const list = await Feedback.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();
  res.json(list);
});

router.post(
  "/",
  authMiddleware,
  requireRole("student", "owner"),
  async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const n = Number(rating);
      if (!Number.isInteger(n) || n < 1 || n > 5) {
        return res.status(400).json({ message: "Rating must be 1–5 stars." });
      }
      if (!comment || String(comment).trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Comment must be at least 3 characters." });
      }
      const fb = await Feedback.create({
        user: req.user._id,
        rating: n,
        comment: String(comment).trim(),
      });
      const populated = await fb.populate("user", "name email role");
      res.status(201).json(populated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
