"use client";

import { useCallback, useEffect, useState } from "react";
import type { Deck, SavedDeck } from "@/types/deck";
import {
  deleteDeck as removeDeck,
  getDeckById,
  loadDecks,
  saveDeck as persistDeck,
} from "@/lib/decks/deck-storage";

export function useSavedDecks() {
  const [decks, setDecks] = useState<SavedDeck[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setDecks(loadDecks());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const save = useCallback(
    (deck: Deck) => {
      const saved = persistDeck(deck);
      refresh();
      return saved;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeDeck(id);
      refresh();
    },
    [refresh]
  );

  const getById = useCallback((id: string) => getDeckById(id), []);

  return { decks, save, remove, getById, ready };
}
