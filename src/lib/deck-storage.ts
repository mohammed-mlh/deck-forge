import type { Deck, SavedDeck } from "@/types/deck";

const STORAGE_KEY = "deck-forge:decks";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadDecks(): SavedDeck[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedDeck[];
    return Array.isArray(parsed) ? parsed : [];
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
