"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addCardToDeck,
  moveCardInDeck,
  removeCardFromDeck,
} from "@/lib/decks/deck-editor";
import { countZone, createEmptyDeck, validateDeck } from "@/lib/deck-rules";
import type { Deck, DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

export function useDeck(initial?: Deck) {
  const [deck, setDeck] = useState<Deck>(initial ?? createEmptyDeck());

  const issues = useMemo(() => validateDeck(deck), [deck]);

  const stats = useMemo(
    () => ({
      main: countZone(deck.main),
      extra: countZone(deck.extra),
      side: countZone(deck.side),
    }),
    [deck]
  );

  const addCard = useCallback((card: YugiohCard, zone?: DeckZone) => {
    setDeck((prev) => {
      const result = addCardToDeck(prev, card, zone);
      return result.ok ? result.deck : prev;
    });
  }, []);

  const removeCard = useCallback((cardId: number, zone: DeckZone) => {
    setDeck((prev) => removeCardFromDeck(prev, cardId, zone));
  }, []);

  const moveCard = useCallback((cardId: number, from: DeckZone, to: DeckZone) => {
    setDeck((prev) => moveCardInDeck(prev, cardId, from, to));
  }, []);

  const resetDeck = useCallback(() => {
    setDeck(createEmptyDeck());
  }, []);

  const setDeckName = useCallback((name: string) => {
    setDeck((prev) => ({ ...prev, name }));
  }, []);

  const replaceDeck = useCallback((next: Deck) => {
    setDeck(next);
  }, []);

  return {
    deck,
    stats,
    issues,
    addCard,
    removeCard,
    moveCard,
    resetDeck,
    setDeckName,
    replaceDeck,
  };
}
