export type {
  CreateDeckInput,
  UpdateDeckInput,
} from "@/features/decks/decks.schema";

export type DeckVisibility = "private" | "unlisted" | "public";

export interface DeckCardRef {
  id: number;
  quantity: number;
}

export type DeckZoneRefs = DeckCardRef[];
