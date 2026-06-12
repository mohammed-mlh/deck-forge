import type { DeckCardEntry } from "@/types/deck";

export type DeckSource = "official" | "community" | "user";
export type DeckVisibility = "public" | "private";
export type DeckDifficulty = "beginner" | "intermediate" | "advanced";

export interface DeckAuthor {
  id?: string;
  name: string;
}

export interface PublicDeck {
  id: string;
  slug: string;
  name: string;
  source: DeckSource;
  author?: DeckAuthor;
  visibility: DeckVisibility;
  description: string;
  archetype: string;
  tags: string[];
  difficulty?: DeckDifficulty;
  main: DeckCardEntry[];
  extra: DeckCardEntry[];
  side: DeckCardEntry[];
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  copies?: number;
}
