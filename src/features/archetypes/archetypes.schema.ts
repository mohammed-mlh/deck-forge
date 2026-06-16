import { z } from "zod";

export const archetypeSearchSchema = z.object({
  name: z.string().trim().optional(),
  num: z.coerce.number().int().min(1).max(500).optional().default(500),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type ArchetypeSearchQuery = z.infer<typeof archetypeSearchSchema>;
