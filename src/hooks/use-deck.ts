"use client";

import { useCallback, useMemo, useState } from "react";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import {
  canAddCardToZone,
  countZone,
  createEmptyDeck,
  getDefaultZoneForCard,
  validateDeck,
} from "@/lib/deck-rules";
import type { YugiohCard } from "@/types/yugioh";

function upsertEntry(entries: DeckCardEntry[], card: YugiohCard): DeckCardEntry[] {
  const existing = entries.find((e) => e.card.id === card.id);
  if (existing) {
    return entries.map((e) =>
      e.card.id === card.id ? { ...e, quantity: e.quantity + 1 } : e
    );
  }
  return [...entries, { card, quantity: 1 }];
}

function removeOneEntry(entries: DeckCardEntry[], cardId: number): DeckCardEntry[] {
  return entries
    .map((e) =>
      e.card.id === cardId ? { ...e, quantity: e.quantity - 1 } : e
    )
    .filter((e) => e.quantity > 0);
}

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
    const targetZone = zone ?? getDefaultZoneForCard(card);
    setDeck((prev) => {
      const check = canAddCardToZone(prev, card, targetZone);
      if (!check.ok) return prev;
      return {
        ...prev,
        [targetZone]: upsertEntry(prev[targetZone], card),
      };
    });
  }, []);

  const removeCard = useCallback((cardId: number, zone: DeckZone) => {
    setDeck((prev) => ({
      ...prev,
      [zone]: removeOneEntry(prev[zone], cardId),
    }));
  }, []);

  const moveCard = useCallback(
    (cardId: number, from: DeckZone, to: DeckZone) => {
      setDeck((prev) => {
        const entry = prev[from].find((e) => e.card.id === cardId);
        if (!entry) return prev;

        const check = canAddCardToZone(prev, entry.card, to);
        if (!check.ok) return prev;

        const fromUpdated = removeOneEntry(prev[from], cardId);
        const toUpdated = upsertEntry(prev[to], entry.card);

        return { ...prev, [from]: fromUpdated, [to]: toUpdated };
      });
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
