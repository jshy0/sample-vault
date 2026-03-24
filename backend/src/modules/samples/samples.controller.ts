import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { SamplesService } from "./samples.service.js";
import { CreateSampleSchema } from "./samples.schema.js";

export const SamplesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const samples = await SamplesService.getAllSamples(userId);
      res.json(samples);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const parsed = CreateSampleSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: z.treeifyError(parsed.error) });
      }

      const sample = await SamplesService.createSample(userId, parsed.data);
      res.status(201).json(sample);
    } catch (err) {
      next(err);
    }
  },
};
