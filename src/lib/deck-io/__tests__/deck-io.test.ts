import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Deck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";
import {
  detectDeckFormat,
  parseDeckContent,
  parseYgoprodeckTxt,
  parseYdk,
  parseYdke,
} from "@/lib/deck-io/parse";
import {
  exportDeck,
  exportDeckToTxt,
  exportDeckToYdk,
  exportDeckToYdke,
  exportDeckToJsonPortable,
} from "@/lib/deck-io/export";
import { resolveParsedDeck, tryImportJsonFullDeck } from "@/lib/deck-io/resolve";

function mockCard(id: number, name: string): YugiohCard {
  return {
    id,
    name,
    type: "Normal Monster",
    desc: "test",
    frameType: "normal",
    card_images: [
      {
        id,
        image_url: `https://example.com/${id}.jpg`,
        image_url_small: `https://example.com/${id}_small.jpg`,
        image_url_cropped: `https://example.com/${id}_cropped.jpg`,
      },
    ],
  };
}

function sampleDeck(): Deck {
  return {
    id: "deck-1",
    name: "Test Deck",
    main: [
      { card: mockCard(89631139, "Blue-Eyes White Dragon"), quantity: 3 },
      { card: mockCard(46986414, "Dark Magician"), quantity: 1 },
    ],
    extra: [{ card: mockCard(44508094, "Stardust Dragon"), quantity: 1 }],
    side: [{ card: mockCard(83764718, "Monster Reborn"), quantity: 2 }],
  };
}

vi.mock("@/lib/ygoprodeck", () => ({
  fetchCards: vi.fn(),
  fetchCardsByIds: vi.fn(),
}));

import { fetchCards, fetchCardsByIds } from "@/lib/ygoprodeck";

const mockedFetchCards = vi.mocked(fetchCards);
const mockedFetchByIds = vi.mocked(fetchCardsByIds);

beforeEach(() => {
  vi.clearAllMocks();
  const pool = [
    mockCard(89631139, "Blue-Eyes White Dragon"),
    mockCard(46986414, "Dark Magician"),
    mockCard(44508094, "Stardust Dragon"),
    mockCard(83764718, "Monster Reborn"),
  ];
  mockedFetchCards.mockImplementation(async (params) => {
    const name = params?.name?.toLowerCase();
    if (!name) return [];
    return pool.filter((card) => card.name.toLowerCase() === name);
  });
  mockedFetchByIds.mockImplementation(async (ids: number[]) =>
    pool.filter((c) => ids.includes(c.id))
  );
});

describe("parse", () => {
  it("parses YGOProDeck txt with zones and quantities", () => {
    const parsed = parseYgoprodeckTxt(`#main
Blue-Eyes White Dragon
Blue-Eyes White Dragon
Dark Magician
#extra
Stardust Dragon
!side
Monster Reborn`);

    expect(parsed.main).toEqual([
      { name: "Blue-Eyes White Dragon", quantity: 2 },
      { name: "Dark Magician", quantity: 1 },
    ]);
    expect(parsed.extra).toEqual([{ name: "Stardust Dragon", quantity: 1 }]);
    expect(parsed.side).toEqual([{ name: "Monster Reborn", quantity: 1 }]);
  });

  it("parses YDK by card id", () => {
    const parsed = parseYdk(`#main
89631139
89631139
46986414
#extra
44508094
!side
83764718`);

    expect(parsed.main).toEqual([
      { id: 89631139, quantity: 2 },
      { id: 46986414, quantity: 1 },
    ]);
    expect(parsed.extra[0]).toEqual({ id: 44508094, quantity: 1 });
    expect(parsed.side[0]).toEqual({ id: 83764718, quantity: 1 });
  });

  it("parses YDKE payload", () => {
    const ydke = exportDeckToYdke(sampleDeck());
    const parsed = parseYdke(ydke);

    expect(parsed.main).toEqual([
      { id: 89631139, quantity: 3 },
      { id: 46986414, quantity: 1 },
    ]);
    expect(parsed.extra[0]).toEqual({ id: 44508094, quantity: 1 });
    expect(parsed.side[0]).toEqual({ id: 83764718, quantity: 2 });
  });

  it("parses portable JSON", () => {
    const json = exportDeckToJsonPortable(sampleDeck());
    const parsed = parseDeckContent(json, "json-portable");

    expect(parsed.name).toBe("Test Deck");
    expect(parsed.main).toEqual([
      { id: 89631139, quantity: 3 },
      { id: 46986414, quantity: 1 },
    ]);
  });

  it("parses CSV with header", () => {
    const parsed = parseDeckContent(
      `zone,id,name,quantity
main,89631139,Blue-Eyes White Dragon,3
extra,44508094,Stardust Dragon,1`,
      "csv"
    );

    expect(parsed.main[0]).toEqual({ id: 89631139, name: "Blue-Eyes White Dragon", quantity: 3 });
    expect(parsed.extra[0]).toEqual({ id: 44508094, name: "Stardust Dragon", quantity: 1 });
  });
});

describe("detectDeckFormat", () => {
  it("detects by extension and content", () => {
    expect(detectDeckFormat('ydke://abc!def!ghi')).toBe("ydke");
    expect(detectDeckFormat("#main\n89631139", "deck.ydk")).toBe("ydk");
    expect(detectDeckFormat("#main\nBlue-Eyes", "deck.txt")).toBe("ygoprodeck-txt");
    expect(detectDeckFormat('{"main":[{"id":1,"quantity":1}]}')).toBe("json-portable");
    expect(detectDeckFormat("89631139, 46986414")).toBe("plain-ids");
    expect(detectDeckFormat("Dark Magician\nBlue-Eyes")).toBe("plain-names");
  });
});

describe("export roundtrip", () => {
  const deck = sampleDeck();

  it("txt export roundtrips", () => {
    const txt = exportDeckToTxt(deck);
    const parsed = parseYgoprodeckTxt(txt);

    expect(parsed.main).toEqual([
      { name: "Blue-Eyes White Dragon", quantity: 3 },
      { name: "Dark Magician", quantity: 1 },
    ]);
    expect(parsed.extra[0]).toEqual({ name: "Stardust Dragon", quantity: 1 });
    expect(parsed.side[0]).toEqual({ name: "Monster Reborn", quantity: 2 });
  });

  it("ydk export roundtrips", () => {
    const ydk = exportDeckToYdk(deck);
    const parsed = parseYdk(ydk);

    expect(parsed.main).toEqual([
      { id: 89631139, quantity: 3 },
      { id: 46986414, quantity: 1 },
    ]);
  });

  it("exportDeck dispatches by format", () => {
    expect(exportDeck(deck, "ygoprodeck-txt")).toContain("#main");
    expect(exportDeck(deck, "ydk")).toContain("89631139");
    expect(exportDeck(deck, "ydke")).toMatch(/^ydke:\/\//);
    expect(JSON.parse(exportDeck(deck, "json-portable"))).toMatchObject({
      name: "Test Deck",
    });
  });
});

describe("resolve", () => {
  it("resolves parsed refs to deck entries", async () => {
    const result = await resolveParsedDeck({
      main: [{ id: 89631139, quantity: 2 }],
      extra: [],
      side: [{ name: "Monster Reborn", quantity: 1 }],
    });

    expect(result.main).toHaveLength(1);
    expect(result.main[0].card.id).toBe(89631139);
    expect(result.main[0].quantity).toBe(2);
    expect(result.side[0].card.name).toBe("Monster Reborn");
    expect(result.errors).toHaveLength(0);
  });

  it("reports unresolved cards", async () => {
    const result = await resolveParsedDeck({
      main: [{ id: 99999999, quantity: 1 }],
      extra: [],
      side: [],
    });

    expect(result.main).toHaveLength(0);
    expect(result.errors.some((e) => e.includes("99999999"))).toBe(true);
  });

  it("imports json-full decks without API lookup", () => {
    const deck = sampleDeck();
    const result = tryImportJsonFullDeck(JSON.stringify(deck));

    expect(result?.main).toHaveLength(2);
    expect(result?.main[0].card.name).toBe("Blue-Eyes White Dragon");
    expect(result?.errors).toHaveLength(0);
    expect(mockedFetchCards).not.toHaveBeenCalled();
    expect(mockedFetchByIds).not.toHaveBeenCalled();
  });
});
