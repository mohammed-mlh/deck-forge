import type { SavedDeck } from "@/types/deck";

export interface PrebuiltDeck extends SavedDeck {
  author: string;
  description: string;
  archetype: string;
}
