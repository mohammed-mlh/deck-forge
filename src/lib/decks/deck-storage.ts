import type { Deck, DeckCardEntry, SavedDeck } from "@/types/deck";

const STORAGE_KEY = "deck-forge:decks";

function isBrowser() {
  return typeof window !== "undefined";
}

function isDeckCardEntry(value: unknown): value is DeckCardEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as DeckCardEntry;
  return (
    typeof entry.quantity === "number" &&
    !!entry.card &&
    typeof entry.card.id === "number" &&
    typeof entry.card.name === "string"
  );
}

export function isValidSavedDeck(deck: unknown): deck is SavedDeck {
  if (!deck || typeof deck !== "object") return false;
  const candidate = deck as SavedDeck;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    Array.isArray(candidate.main) &&
    Array.isArray(candidate.extra) &&
    Array.isArray(candidate.side) &&
    candidate.main.every(isDeckCardEntry) &&
    candidate.extra.every(isDeckCardEntry) &&
    candidate.side.every(isDeckCardEntry)
  );
}

export function loadDecks(): SavedDeck[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSavedDeck);
  } catch {
    return [];
  }
}

export function getDeckById(id: string): SavedDeck | undefined {
  return loadDecks().find((d) => d.id === id);
}

export function saveDeck(deck: Deck): SavedDeck {
  const saved: SavedDeck = {
    ...deck,
    updatedAt: new Date().toISOString(),
  };
  const decks = loadDecks();
  const index = decks.findIndex((d) => d.id === deck.id);
  if (index >= 0) {
    decks[index] = saved;
  } else {
    decks.unshift(saved);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  return saved;
}

export function deleteDeck(id: string): void {
  const decks = loadDecks().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}
