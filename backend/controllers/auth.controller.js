import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// @desc   Signup new user
// @route  POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email , role:user.role} });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get user profile (protected)
// @route  GET /api/auth/profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
