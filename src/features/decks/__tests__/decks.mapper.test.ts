import { describe, expect, it } from "vitest";
import type { DeckRecord } from "@/db/schema/decks";
import {
  deckRecordToSavedDeck,
  deckToCreateInput,
  entriesToRefs,
} from "@/features/decks/decks.mapper";
import type { Deck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

function mockCard(id: number): YugiohCard {
  return {
    id,
    name: `Card ${id}`,
    type: "Effect Monster",
    desc: "",
    frameType: "effect",
    card_images: [
      {
        id,
        image_url: `https://example.com/${id}.jpg`,
        image_url_small: `https://example.com/${id}_s.jpg`,
        image_url_cropped: `https://example.com/${id}_c.jpg`,
      },
    ],
  };
}

describe("entriesToRefs", () => {
  it("maps card entries to id refs", () => {
    expect(entriesToRefs([{ card: mockCard(42), quantity: 3 }])).toEqual([
      { id: 42, quantity: 3 },
    ]);
  });
});

describe("deckToCreateInput", () => {
  it("strips editor fields and keeps zone refs", () => {
    const deck: Deck = {
      id: "uuid",
      name: "My Deck",
      main: [{ card: mockCard(1), quantity: 1 }],
      extra: [],
      side: [],
    };
    expect(deckToCreateInput(deck)).toEqual({
      name: "My Deck",
      main: [{ id: 1, quantity: 1 }],
      extra: [],
      side: [],
    });
  });
});

describe("deckRecordToSavedDeck", () => {
  it("maps DB record to saved deck with stub cards", () => {
    const updatedAt = new Date("2026-01-15T12:00:00Z");
    const record: DeckRecord = {
      id: "deck-id",
      userId: "user-1",
      name: "Saved",
      slug: "saved",
      visibility: "private",
      main: [{ id: 100, quantity: 2 }],
      extra: [],
      side: [],
      createdAt: updatedAt,
      updatedAt,
    };
    const saved = deckRecordToSavedDeck(record);
    expect(saved.id).toBe("deck-id");
    expect(saved.name).toBe("Saved");
    expect(saved.visibility).toBe("private");
    expect(saved.updatedAt).toBe(updatedAt.toISOString());
    expect(saved.main[0]?.card.id).toBe(100);
    expect(saved.main[0]?.quantity).toBe(2);
    expect(saved.main[0]?.card.name).toBe("Loading…");
  });
});
