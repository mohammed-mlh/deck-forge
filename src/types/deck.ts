import type { YugiohCard } from "@/types/yugioh";

export type DeckZone = "main" | "extra" | "side";

export interface DeckCardEntry {
  card: YugiohCard;
  quantity: number;
}

export type DeckVisibility = "private" | "public";

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
  visibility: DeckVisibility;
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
