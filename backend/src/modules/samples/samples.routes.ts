import { Router } from "express";
import { SamplesController } from "./samples.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.get("/", SamplesController.getAll);
router.post("/", upload.single("file"), SamplesController.create);
router.delete("/:id", SamplesController.remove);

export default router;
