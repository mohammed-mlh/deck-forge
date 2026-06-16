"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addCardToDeck,
  moveCardInDeck,
  removeCardFromDeck,
} from "@/lib/decks/deck-editor";
import { countZone, createEmptyDeck, validateDeck } from "@/lib/deck-rules";
import type { Deck, DeckZone } from "@/features/decks/decks.schema";
import type { Card } from "@/features/cards/cards.schema";

type DeckActionResult = { ok: true } | { ok: false; reason?: string };

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

  const addCard = useCallback((card: Card, zone?: DeckZone): DeckActionResult => {
    let result: DeckActionResult = { ok: true };
    setDeck((prev) => {
      const next = addCardToDeck(prev, card, zone);
      if (!next.ok) {
        result = { ok: false, reason: next.reason };
        return prev;
      }
      return next.deck;
    });
    return result;
  }, []);

  const removeCard = useCallback((cardId: number, zone: DeckZone) => {
    setDeck((prev) => removeCardFromDeck(prev, cardId, zone));
  }, []);

  const moveCard = useCallback(
    (cardId: number, from: DeckZone, to: DeckZone): DeckActionResult => {
      let result: DeckActionResult = { ok: true };
      setDeck((prev) => {
        const next = moveCardInDeck(prev, cardId, from, to);
        if (!next.ok) {
          result = { ok: false, reason: next.reason };
          return prev;
        }
        return next.deck;
      });
      return result;
    },
    []
  );

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
