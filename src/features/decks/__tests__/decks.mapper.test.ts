import { describe, expect, it } from "vitest";
import { entriesToRefs } from "@/features/decks/decks.mapper";
import type { Card } from "@/features/cards/cards.schema";

function mockCard(id: number, overrides: Partial<Card> = {}): Card {
  return { id, name: `Card ${id}`, type: "Normal Monster", frameType: "normal", desc: "test", images: [], ...overrides } as Card;
}

describe("entriesToRefs", () => {
  it("maps card entries to id refs", () => {
    const refs = entriesToRefs([{ card: mockCard(1), quantity: 2 }]);
    expect(refs).toEqual([{ id: 1, quantity: 2 }]);
  });
});
