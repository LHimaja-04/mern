import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// public routes
router.post("/register", register);
router.post("/login", login);

// protected route
router.get("/me", requireAuth, me);

export default router;
