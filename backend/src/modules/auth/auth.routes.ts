import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "./auth.controller";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);

export default router;
