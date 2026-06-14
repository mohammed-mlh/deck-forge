import type { DeckRecord } from "@/db/schema/decks";
import type { CreateDeckInput, DeckZoneRefs } from "@/features/decks/decks.schema";
import { card } from "@/lib/decks/deck-utils";
import type { Deck, DeckCardEntry, SavedDeck } from "@/types/deck";

function refsToEntries(refs: DeckZoneRefs): DeckCardEntry[] {
  return refs.map(({ id, quantity }) => ({
    card: card(id, "Loading…", "Unknown"),
    quantity,
  }));
}

function entriesToRefs(entries: DeckCardEntry[]): DeckZoneRefs {
  return entries.map(({ card: c, quantity }) => ({ id: c.id, quantity }));
}

export function deckRecordToSavedDeck(record: DeckRecord): SavedDeck {
  return {
    id: record.id,
    name: record.name,
    main: refsToEntries(record.main),
    extra: refsToEntries(record.extra),
    side: refsToEntries(record.side),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function deckToCreateInput(deck: Deck): CreateDeckInput {
  return {
    name: deck.name,
    main: entriesToRefs(deck.main),
    extra: entriesToRefs(deck.extra),
    side: entriesToRefs(deck.side),
  };
}
