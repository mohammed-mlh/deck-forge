import { describe, expect, it } from "vitest";
import type { DeckDoctorResult } from "@/lib/ai/types";
import { sanitizeDeckDoctorResult } from "@/lib/ai/sanitize-deck-doctor";
import type { Deck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

function mockCard(id: number, name: string): YugiohCard {
  return {
    id,
    name,
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

function deck(): Deck {
  return {
    id: "d1",
    name: "Test",
    main: [{ card: mockCard(1, "Ash Blossom"), quantity: 2 }],
    extra: [],
    side: [{ card: mockCard(2, "Called by the Grave"), quantity: 1 }],
  };
}

describe("sanitizeDeckDoctorResult", () => {
  it("drops removes for cards not in deck", () => {
    const result: DeckDoctorResult = {
      reason: "test",
      remove: [{ name: "Maxx C", quantity: 1 }],
      add: [],
    };
    expect(sanitizeDeckDoctorResult(result, deck()).remove).toEqual([]);
  });

  it("caps remove quantity to available copies", () => {
    const result: DeckDoctorResult = {
      reason: "test",
      remove: [{ name: "ash blossom", quantity: 5 }],
      add: [],
    };
    const sanitized = sanitizeDeckDoctorResult(result, deck());
    expect(sanitized.remove).toEqual([{ name: "Ash Blossom", quantity: 2 }]);
  });

  it("respects zone-specific inventory", () => {
    const result: DeckDoctorResult = {
      reason: "test",
      remove: [{ name: "Ash Blossom", quantity: 1, zone: "side" }],
      add: [],
    };
    expect(sanitizeDeckDoctorResult(result, deck()).remove).toEqual([]);
  });
});
