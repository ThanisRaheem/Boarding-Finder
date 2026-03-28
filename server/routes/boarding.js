import express from "express";
import {
  MOCK_BOARDINGS,
  getBoardingById,
  getRandomBoarding,
} from "../data/boardings.js";

const router = express.Router();

router.get("/list", (_req, res) => {
  res.json(MOCK_BOARDINGS);
});

router.get("/random", (_req, res) => {
  res.json(getRandomBoarding());
});

router.get("/:id", (req, res) => {
  const b = getBoardingById(req.params.id);
  if (!b) return res.status(404).json({ message: "Boarding not found" });
  res.json(b);
});

export default router;
