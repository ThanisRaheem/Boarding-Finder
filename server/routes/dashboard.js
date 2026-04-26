import express from "express";
import Feedback from "../models/Feedback.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/feedback-stats", authMiddleware, requireRole("admin", "owner"), async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { isVerified: true } },
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    const monthlyTrends = await Feedback.aggregate([
      { $match: { isVerified: true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            sentiment: "$sentiment"
          },
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $match: { isVerified: true } },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      sentimentStats: stats,
      monthlyTrends,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recent-feedback", authMiddleware, requireRole("admin", "owner"), async (req, res) => {
  try {
    const { page = 1, limit = 20, sentiment, category } = req.query;
    
    const filter = { isVerified: true };
    if (sentiment) filter.sentiment = sentiment;
    if (category) filter.categories = category;

    const feedback = await Feedback.find(filter)
      .populate("user", "name email")
      .populate("boarding", "name address")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/alerts", authMiddleware, requireRole("admin", "owner"), async (req, res) => {
  try {
    const recentNegative = await Feedback.find({
      sentiment: "negative",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    .populate("boarding", "name address")
    .limit(10);

    const lowRatings = await Feedback.find({
      rating: { $lte: 2 },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .populate("boarding", "name address")
    .limit(10);

    res.json({
      recentNegative,
      lowRatings,
      alertCount: recentNegative.length + lowRatings.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
