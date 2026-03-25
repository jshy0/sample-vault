import { Router } from "express";
import { SamplesController } from "./samples.controller";
import { upload } from "../../middleware/upload";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.get("/", SamplesController.getAll);
router.post("/", authenticate, upload.single("file"), SamplesController.create);
router.delete("/:id", authenticate, SamplesController.remove);

export default router;
