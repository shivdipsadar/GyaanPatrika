// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import attemptRouter from "./routes/attempt.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());



// Routes (placeholder)
app.use("/api/auth",authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/attempts", attemptRouter);


// Placeholder route for the root path
app.get("/", (req, res) => {
  res.send("Quiz App Backend is running 🚀");
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
