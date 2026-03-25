import { z } from "zod";

const MUSICAL_KEYS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "Cm",
  "C#m",
  "Dm",
  "D#m",
  "Em",
  "Fm",
  "F#m",
  "Gm",
  "G#m",
  "Am",
  "A#m",
  "Bm",
  "\u2014",
] as const;

export const CreateSampleSchema = z.object({
  name: z.string().min(1).max(100),
  bpm: z.number().int().positive().min(20).max(300),
  key: z.enum(MUSICAL_KEYS),
  tags: z.array(z.string().max(50)).max(10).default([]),
});

export type CreateSampleDTO = z.infer<typeof CreateSampleSchema>;
