import { Router } from "express";
import { SamplesController } from "./samples.controller";

const router = Router();

router.get("/", SamplesController.getAll);
router.post("/", SamplesController.create);

export default router;
