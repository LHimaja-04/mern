import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, // 120 req/min per IP
  standardHeaders: true,
  legacyHeaders: false
});
