import { Router } from "express";
import { createOrder, myOrders } from "../controllers/orders.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, myOrders);

export default router;
