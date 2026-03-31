import { Router } from "express";
import rateLimit from "express-rate-limit";
import { SamplesController } from "./samples.controller";
import { upload, validateWavBuffer } from "../../middleware/upload";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20,
  keyGenerator: (req) => req.user!.userId,
  message: { error: "Upload limit reached. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", SamplesController.search);
router.post(
  "/",
  authenticate,
  uploadRateLimit,
  upload.single("file"),
  validateWavBuffer,
  SamplesController.create,
);
router.delete("/:id", authenticate, SamplesController.remove);

export default router;
