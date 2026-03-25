import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { SamplesService } from "./samples.service.js";
import { CreateSampleSchema } from "./samples.schema.js";

export const SamplesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const samples = await SamplesService.getAllSamples();
      res.json(samples);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      if (!req.file) {
        return res.status(400).json({ error: "Audio file is required" });
      }

      let tags: unknown;
      try {
        tags = JSON.parse(req.body.tags ?? "[]");
      } catch {
        return res.status(400).json({ error: "Invalid JSON for tags field." });
      }

      const parsed = CreateSampleSchema.safeParse({
        ...req.body,
        bpm: Number(req.body.bpm),
        tags,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const sample = await SamplesService.createSample(
        userId,
        parsed.data,
        req.file,
      );
      res.status(201).json(sample);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await SamplesService.deleteSample(req.params.id as string, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
