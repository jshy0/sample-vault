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
] as const;

const MUSICAL_MODES = ["Major", "Minor"] as const;

export const CreateSampleSchema = z.object({
  name: z.string().min(1).max(100),
  bpm: z.number().int().positive().min(20).max(300).optional(),
  key: z.enum(MUSICAL_KEYS).optional(),
  mode: z.enum(MUSICAL_MODES).optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
});

export type CreateSampleDTO = z.infer<typeof CreateSampleSchema>;

export const SearchQuerySchema = z.object({
  q: z.string().optional(),
  key: z.enum(MUSICAL_KEYS).optional(),
  mode: z.enum(MUSICAL_MODES).optional(),
  bpm_min: z.coerce.number().int().min(20).max(300).optional(),
  bpm_max: z.coerce.number().int().min(20).max(300).optional(),
});

export type SearchQueryDTO = z.infer<typeof SearchQuerySchema>;
