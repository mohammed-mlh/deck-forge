import type { DeckRecord } from "@/db/schema/decks";
import type { CreateDeckInput, DeckZoneRefs } from "@/features/decks/decks.schema";
import type { Deck, DeckCardEntry, SavedDeck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

function stubCard(id: number): YugiohCard {
  const base = "https://images.ygoprodeck.com/images";
  return {
    id,
    name: "Loading…",
    type: "Unknown",
    desc: "",
    frameType: "effect",
    card_images: [
      {
        id,
        image_url: `${base}/cards/${id}.jpg`,
        image_url_small: `${base}/cards_small/${id}.jpg`,
        image_url_cropped: `${base}/cards_cropped/${id}.jpg`,
      },
    ],
  };
}

export function entriesToRefs(entries: DeckCardEntry[]): DeckZoneRefs {
  return entries.map(({ card: c, quantity }) => ({ id: c.id, quantity }));
}

function refsToEntries(refs: DeckZoneRefs): DeckCardEntry[] {
  return refs.map(({ id, quantity }) => ({
    card: stubCard(id),
    quantity,
  }));
}

export function deckRecordToSavedDeck(record: DeckRecord): SavedDeck {
  return {
    id: record.id,
    name: record.name,
    main: refsToEntries(record.main),
    extra: refsToEntries(record.extra),
    side: refsToEntries(record.side),
    visibility: record.visibility,
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function deckToCreateInput(deck: Deck): CreateDeckInput {
  return {
    name: deck.name,
    main: entriesToRefs(deck.main),
    extra: entriesToRefs(deck.extra),
    side: entriesToRefs(deck.side),
    visibility: deck.visibility ?? "private",
  };
}
