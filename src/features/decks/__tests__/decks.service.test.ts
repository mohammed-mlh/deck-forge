import { describe, expect, it, vi, beforeEach } from "vitest";
import type { DeckRecord } from "@/db/schema/decks";

vi.mock("@/features/decks/decks.repository", () => ({
  findDeckById: vi.fn(),
  findDeckByUserSlug: vi.fn(),
  findDecksByUserId: vi.fn(),
  findPublicDeckById: vi.fn(),
  findPublicDecks: vi.fn(),
  insertDeck: vi.fn(),
  updateDeckById: vi.fn(),
  deleteDeckById: vi.fn(),
}));

vi.mock("@/lib/ygoprodeck", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/ygoprodeck")>();
  return {
    ...actual,
    fetchCardsByIds: vi.fn(),
  };
});

import {
  createDeck,
  getDeckById,
  updateDeck,
} from "@/features/decks/decks.service";
import { findDeckById, findDeckByUserSlug, insertDeck, updateDeckById } from "@/features/decks/decks.repository";
import { fetchCardsByIds } from "@/lib/ygoprodeck";

const mockedInsert = vi.mocked(insertDeck);
const mockedFindById = vi.mocked(findDeckById);
const mockedFindSlug = vi.mocked(findDeckByUserSlug);
const mockedUpdate = vi.mocked(updateDeckById);
const mockedFetchIds = vi.mocked(fetchCardsByIds);

const spell = {
  id: 1,
  name: "Pot of Greed",
  type: "Spell Card",
  desc: "",
  frameType: "spell",
  card_images: [{ id: 1, image_url: "", image_url_small: "", image_url_cropped: "" }],
};

function deckRecord(overrides: Partial<DeckRecord> = {}): DeckRecord {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: "deck-1",
    userId: "user-1",
    name: "Test Deck",
    slug: "test-deck",
    visibility: "private",
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
  mockedFetchIds.mockResolvedValue([spell]);
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

  it("inserts with private visibility", async () => {
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
        visibility: "private",
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
