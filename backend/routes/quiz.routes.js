import express from "express";
import { authMiddleware, requireAdmin } from "../middleware/auth.js";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  getAdminQuizzes,
} from "../controllers/quiz.controller.js";
import { updateQuiz } from "../controllers/quiz.controller.js";

const quizRouter = express.Router();

// Admin only
quizRouter.post("/", authMiddleware, requireAdmin, createQuiz);
quizRouter.delete("/:id", authMiddleware, requireAdmin, deleteQuiz);

quizRouter.get("/my-quizzes", authMiddleware, requireAdmin, getAdminQuizzes);

// Admin only
quizRouter.put("/:id", authMiddleware, requireAdmin, updateQuiz);


// Accessible to all logged-in users
quizRouter.get("/", authMiddleware, getAllQuizzes);
quizRouter.get("/:id", authMiddleware, getQuizById);

export default quizRouter;
