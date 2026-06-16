import { z } from "zod";
import type { Card } from "@/features/cards/cards.schema";

export const deckCardRefSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).max(3),
});

export const deckZoneRefsSchema = z.array(deckCardRefSchema);

export const createDeckSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(64).optional(),
  main: deckZoneRefsSchema.optional(),
  extra: deckZoneRefsSchema.optional(),
  side: deckZoneRefsSchema.optional(),
});

export const updateDeckSchema = createDeckSchema.partial();

export type DeckCardRef = z.infer<typeof deckCardRefSchema>;
export type DeckZoneRefs = z.infer<typeof deckZoneRefsSchema>;
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export type DeckZone = "main" | "extra" | "side";

export interface DeckCardEntry {
  card: Card;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  main: DeckCardEntry[];
  extra: DeckCardEntry[];
  side: DeckCardEntry[];
  /** Deck label fallback when cards lack API archetype data. */
  archetype?: string;
}

export interface SavedDeck extends Deck {
  updatedAt: string;
}

export interface DeckValidationIssue {
  zone?: DeckZone;
  cardId?: number;
  message: string;
  severity: "error" | "warning";
}

export const DECK_LIMITS = {
  main: { min: 40, max: 60 },
  extra: { min: 0, max: 15 },
  side: { min: 0, max: 15 },
  maxCopies: 3,
} as const;
