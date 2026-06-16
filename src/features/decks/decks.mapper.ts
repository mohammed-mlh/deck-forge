import type { DeckZoneRefs } from "@/features/decks/decks.schema";
import type { DeckCardEntry } from "@/features/decks/decks.schema";

export function entriesToRefs(entries: DeckCardEntry[]): DeckZoneRefs {
  return entries.map(({ card: c, quantity }) => ({ id: c.id, quantity }));
}
