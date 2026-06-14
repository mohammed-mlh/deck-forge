import { describe, expect, it } from "vitest";
import type { Deck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";
import {
  canAddCardToZone,
  countCardInDeck,
  deckFromRefs,
  getDefaultZoneForCard,
  validateDeck,
  validateDeckRefs,
} from "@/lib/deck-rules";

function card(id: number, name: string, opts: Partial<YugiohCard> = {}): YugiohCard {
  return {
    id,
    name,
    type: opts.type ?? "Effect Monster",
    desc: "",
    frameType: opts.frameType ?? "effect",
    card_images: [
      {
        id,
        image_url: `https://example.com/${id}.jpg`,
        image_url_small: `https://example.com/${id}_s.jpg`,
        image_url_cropped: `https://example.com/${id}_c.jpg`,
      },
    ],
    ...opts,
  };
}

function emptyDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: "d1",
    name: "Test",
    main: [],
    extra: [],
    side: [],
    ...overrides,
  };
}

describe("validateDeckRefs", () => {
  it("flags zone over-limit and copy violations", () => {
    const main = Array.from({ length: 61 }, (_, i) => ({ id: 1000 + i, quantity: 1 }));
    const issues = validateDeckRefs(main, [], []);
    expect(issues.some((i) => i.zone === "main" && i.severity === "error")).toBe(true);
  });

  it("flags more than 3 copies across zones", () => {
    const issues = validateDeckRefs(
      [{ id: 1, quantity: 2 }],
      [{ id: 1, quantity: 2 }],
      []
    );
    expect(issues.some((i) => i.cardId === 1)).toBe(true);
  });
});

describe("validateDeck", () => {
  it("warns when main is under 40", () => {
    const deck = emptyDeck({
      main: [{ card: card(1, "A"), quantity: 1 }],
    });
    const issues = validateDeck(deck);
    expect(issues.some((i) => i.severity === "warning" && i.zone === "main")).toBe(true);
  });

  it("errors when extra-deck monster is in main", () => {
    const fusion = card(2, "Fusion Guy", { type: "Fusion Monster", frameType: "fusion" });
    const deck = emptyDeck({ main: [{ card: fusion, quantity: 1 }] });
    const issues = validateDeck(deck);
    expect(issues.some((i) => i.severity === "error" && i.message.includes("Extra Deck"))).toBe(
      true
    );
  });
});

describe("canAddCardToZone", () => {
  it("rejects extra-deck monsters in main", () => {
    const fusion = card(3, "Link", { type: "Link Monster", frameType: "link" });
    const result = canAddCardToZone(emptyDeck(), fusion, "main");
    expect(result.ok).toBe(false);
  });

  it("rejects when zone is full", () => {
    const c = card(4, "Spell", { type: "Spell Card", frameType: "spell" });
    const deck = emptyDeck({
      side: Array.from({ length: 15 }, (_, i) => ({
        card: card(500 + i, `Side ${i}`, { type: "Spell Card", frameType: "spell" }),
        quantity: 1,
      })),
    });
    const result = canAddCardToZone(deck, c, "side");
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("full");
  });
});

describe("deckFromRefs", () => {
  it("hydrates refs into a deck", () => {
    const c = card(10, "Dragon");
    const deck = deckFromRefs([{ id: 10, quantity: 2 }], [], [], new Map([[10, c]]));
    expect(deck.main).toEqual([{ card: c, quantity: 2 }]);
  });

  it("throws for unknown card id", () => {
    expect(() => deckFromRefs([{ id: 999, quantity: 1 }], [], [], new Map())).toThrow(
      "Unknown card ID 999"
    );
  });
});

describe("getDefaultZoneForCard", () => {
  it("routes fusion to extra", () => {
    expect(getDefaultZoneForCard(card(5, "F", { frameType: "fusion" }))).toBe("extra");
    expect(getDefaultZoneForCard(card(6, "M"))).toBe("main");
  });
});

describe("countCardInDeck", () => {
  it("sums copies across zones", () => {
    const c = card(7, "Dup");
    const deck = emptyDeck({
      main: [{ card: c, quantity: 2 }],
      side: [{ card: c, quantity: 1 }],
    });
    expect(countCardInDeck(deck, 7)).toBe(3);
  });
});
