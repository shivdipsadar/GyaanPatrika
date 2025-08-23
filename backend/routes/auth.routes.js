import express from "express";
import { signup, login, profile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/profile", authMiddleware, profile);

export default authRouter;
