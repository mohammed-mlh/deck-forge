import type { DeckRecord } from "@/db/schema/decks";
import type { Card } from "@/features/cards/cards.schema";
import { getCardsByIds } from "@/features/cards/cards.service";
import type { CreateDeckInput, DeckZoneRefs } from "@/features/decks/decks.schema";
import type { Deck, DeckCardEntry, SavedDeck } from "@/features/decks/decks.schema";

export function entriesToRefs(entries: DeckCardEntry[]): DeckZoneRefs {
  return entries.map(({ card: c, quantity }) => ({ id: c.id, quantity }));
}

function placeholderCard(id: number): Card {
  return {
    id,
    name: "",
    type: "",
    humanReadableCardType: null,
    frameType: "effect",
    desc: "",
    race: null,
    attribute: null,
    atk: null,
    def: null,
    level: null,
    rank: null,
    linkval: null,
    scale: null,
    archetype: null,
    typeline: null,
    linkMarkers: null,
    ygoprodeckUrl: null,
    syncedAt: new Date(0).toISOString(),
    images: [],
  };
}

function collectRefIds(...zones: DeckZoneRefs[]): number[] {
  const ids = new Set<number>();
  for (const refs of zones) {
    for (const ref of refs) ids.add(ref.id);
  }
  return [...ids];
}

function refsToEntries(refs: DeckZoneRefs, byId: Map<number, Card>): DeckCardEntry[] {
  return refs.map(({ id, quantity }) => ({
    card: byId.get(id) ?? placeholderCard(id),
    quantity,
  }));
}

function recordToSavedDeck(record: DeckRecord, byId: Map<number, Card>): SavedDeck {
  return {
    id: record.id,
    name: record.name,
    main: refsToEntries(record.main, byId),
    extra: refsToEntries(record.extra, byId),
    side: refsToEntries(record.side, byId),
    visibility: record.visibility,
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function deckRecordToSavedDeck(record: DeckRecord): Promise<SavedDeck> {
  const ids = collectRefIds(record.main, record.extra, record.side);
  const cards = ids.length > 0 ? await getCardsByIds({ ids }) : [];
  const byId = new Map(cards.map((card) => [card.id, card]));
  return recordToSavedDeck(record, byId);
}

export async function deckRecordsToSavedDecks(records: DeckRecord[]): Promise<SavedDeck[]> {
  if (records.length === 0) return [];

  const ids = new Set<number>();
  for (const record of records) {
    for (const id of collectRefIds(record.main, record.extra, record.side)) {
      ids.add(id);
    }
  }

  const cards = ids.size > 0 ? await getCardsByIds({ ids: [...ids] }) : [];
  const byId = new Map(cards.map((card) => [card.id, card]));
  return records.map((record) => recordToSavedDeck(record, byId));
}

export function deckToCreateInput(deck: Deck): CreateDeckInput {
  return {
    name: deck.name,
    main: entriesToRefs(deck.main),
    extra: entriesToRefs(deck.extra),
    side: entriesToRefs(deck.side),
  };
}
