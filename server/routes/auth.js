import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const nameOk = (v) => /^[A-Za-z\s]+$/.test(String(v || "").trim());
const gmailOk = (v) =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(String(v || "").trim());
const PASS_MIN = 4;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields required." });
    }
    if (!["student", "owner"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Register as student or owner only." });
    }
    if (!nameOk(name)) {
      return res
        .status(400)
        .json({ message: "Full name must contain letters and spaces only." });
    }
    if (!gmailOk(email)) {
      return res.status(400).json({
        message: "Email must be a valid Gmail address ending with @gmail.com.",
      });
    }
    if (String(password).length < PASS_MIN) {
      return res.status(400).json({
        message: `Password must be at least ${PASS_MIN} characters.`,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
