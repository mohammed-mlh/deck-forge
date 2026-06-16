import { describe, expect, it, vi, beforeEach } from "vitest";
import type { DeckRecord } from "@/db/schema/decks";
import {
  deckRecordToSavedDeck,
  deckToCreateInput,
  entriesToRefs,
} from "@/features/decks/decks.mapper";
import type { Deck } from "@/features/decks/decks.schema";
import type { Card } from "@/features/cards/cards.schema";

vi.mock("@/features/cards/cards.service", () => ({
  getCardsByIds: vi.fn(),
}));

import { getCardsByIds } from "@/features/cards/cards.service";

const mockedGetCardsByIds = vi.mocked(getCardsByIds);

function mockCard(id: number, overrides: Partial<Card> = {}): Card {
  return { id, name: `Card ${id}`, type: "Normal Monster", frameType: "normal", desc: "test", images: [], ...overrides } as Card;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetCardsByIds.mockResolvedValue([mockCard(1)]);
});

describe("entriesToRefs", () => {
  it("maps card entries to id refs", () => {
    const refs = entriesToRefs([{ card: mockCard(1), quantity: 2 }]);
    expect(refs).toEqual([{ id: 1, quantity: 2 }]);
  });
});

describe("deckRecordToSavedDeck", () => {
  it("maps deck record to saved deck with loaded cards", async () => {
    const record: DeckRecord = {
      id: "deck-1",
      userId: "user-1",
      name: "Test",
      slug: "test",
      visibility: "private",
      main: [{ id: 1, quantity: 1 }],
      extra: [],
      side: [],
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    };

    const saved = await deckRecordToSavedDeck(record);
    expect(saved.id).toBe("deck-1");
    expect(saved.main[0]?.card.id).toBe(1);
    expect(saved.main[0]?.card.name).toBe("Card 1");
    expect(saved.main[0]?.quantity).toBe(1);
    expect(saved.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });
});

describe("deckToCreateInput", () => {
  it("maps deck zones to create input refs", () => {
    const deck: Deck = {
      id: "d1",
      name: "My Deck",
      main: [{ card: mockCard(1), quantity: 3 }],
      extra: [],
      side: [],
    };

    expect(deckToCreateInput(deck)).toEqual({
      name: "My Deck",
      main: [{ id: 1, quantity: 3 }],
      extra: [],
      side: [],
    });
  });
});
