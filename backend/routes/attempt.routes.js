import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { submitAttempt, getUserAttempts, getAttemptById , getLeaderboard } from "../controllers/attempt.controller.js";

const AttemptRouter = express.Router();

AttemptRouter.post("/:quizId", authMiddleware, submitAttempt);
AttemptRouter.get("/my-attempts", authMiddleware, getUserAttempts);
AttemptRouter.get("/:id", authMiddleware, getAttemptById);

AttemptRouter.get("/:quizId/leaderboard", authMiddleware, getLeaderboard);

export default AttemptRouter;
