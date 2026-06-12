import { z } from "zod";

export const deckCardRefSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(3),
});

export const deckZoneRefsSchema = z.array(deckCardRefSchema);

export const deckVisibilitySchema = z.enum(["private", "unlisted", "public"]);

export const createDeckSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(64).optional(),
  visibility: deckVisibilitySchema.optional(),
  main: deckZoneRefsSchema.optional(),
  extra: deckZoneRefsSchema.optional(),
  side: deckZoneRefsSchema.optional(),
});

export const updateDeckSchema = createDeckSchema.partial();

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
