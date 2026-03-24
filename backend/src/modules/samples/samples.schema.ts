import { z } from "zod";

export const CreateSampleSchema = z.object({
  name: z.string(),
  bpm: z.number().int().positive().min(20).max(300),
  key: z.string(),
  tags: z.array(z.string()).default([]),
});

export type CreateSampleDTO = z.infer<typeof CreateSampleSchema>;
