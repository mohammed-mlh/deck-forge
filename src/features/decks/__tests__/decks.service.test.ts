import { describe, expect, it, vi, beforeEach } from "vitest";
import type { DeckRecord } from "@/db/schema/decks";
import type { Card } from "@/features/cards/cards.schema";

function mockCard(id: number, overrides: Partial<Card> = {}): Card {
  return { id, name: `Card ${id}`, type: "Normal Monster", frameType: "normal", desc: "test", images: [], ...overrides } as Card;
}

vi.mock("@/features/decks/decks.repository", () => ({
  findDeckById: vi.fn(),
  findDeckByUserSlug: vi.fn(),
  findDecksByUserId: vi.fn(),
  insertDeck: vi.fn(),
  updateDeckById: vi.fn(),
  deleteDeckById: vi.fn(),
}));

vi.mock("@/features/cards/cards.service", () => ({
  getCardsByIds: vi.fn(),
}));

import {
  createDeck,
  getDeckById,
  toSavedDeck,
  updateDeck,
} from "@/features/decks/decks.service";
import { findDeckById, findDeckByUserSlug, insertDeck, updateDeckById } from "@/features/decks/decks.repository";
import { getCardsByIds } from "@/features/cards/cards.service";

const mockedInsert = vi.mocked(insertDeck);
const mockedFindById = vi.mocked(findDeckById);
const mockedFindSlug = vi.mocked(findDeckByUserSlug);
const mockedUpdate = vi.mocked(updateDeckById);
const mockedFetchIds = vi.mocked(getCardsByIds);

const spell = mockCard(1, {
  name: "Pot of Greed",
  type: "Spell Card",
  frameType: "spell",
});

function deckRecord(overrides: Partial<DeckRecord> = {}): DeckRecord {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: "deck-1",
    userId: "user-1",
    name: "Test Deck",
    slug: "test-deck",
    main: [],
    extra: [],
    side: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedFindSlug.mockResolvedValue(null);
  mockedFetchIds.mockImplementation(async ({ ids }) =>
    ids.map((id) => (id === 1 ? spell : mockCard(id)))
  );
});

describe("createDeck", () => {
  it("rejects invalid copy counts before insert", async () => {
    await expect(
      createDeck("user-1", {
        name: "Bad",
        main: [{ id: 1, quantity: 4 }],
      })
    ).rejects.toThrow(/copies/);
    expect(mockedInsert).not.toHaveBeenCalled();
  });

  it("inserts a valid deck", async () => {
    const record = deckRecord({ id: "new-id" });
    mockedInsert.mockResolvedValue(record);

    const result = await createDeck("user-1", {
      name: "Good Deck",
      main: [{ id: 1, quantity: 1 }],
    });

    expect(result).toBe(record);
    expect(mockedInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Good Deck",
        main: [{ id: 1, quantity: 1 }],
      })
    );
  });
});

describe("getDeckById", () => {
  it("returns null when deck belongs to another user", async () => {
    mockedFindById.mockResolvedValue(deckRecord({ userId: "other" }));
    expect(await getDeckById("user-1", "deck-1")).toBeNull();
  });
});

describe("updateDeck", () => {
  it("returns null when deck not found on zone update", async () => {
    mockedFindById.mockResolvedValue(null);
    expect(await updateDeck("user-1", "missing", { main: [] })).toBeNull();
  });

  it("validates zone patches against rules", async () => {
    mockedFindById.mockResolvedValue(deckRecord());

    await expect(
      updateDeck("user-1", "deck-1", { main: [{ id: 1, quantity: 4 }] })
    ).rejects.toThrow(/copies/);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});

describe("toSavedDeck", () => {
  it("loads cards for deck refs", async () => {
    const record: DeckRecord = {
      id: "deck-1",
      userId: "user-1",
      name: "Test",
      slug: "test",
      main: [{ id: 1, quantity: 1 }],
      extra: [],
      side: [],
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    };

    const saved = await toSavedDeck(record);
    expect(saved.main[0]?.card.name).toBe("Pot of Greed");
    expect(mockedFetchIds).toHaveBeenCalledWith({ ids: [1] });
  });
});
