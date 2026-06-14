import { canAddCardToZone, getDefaultZoneForCard } from "@/lib/deck-rules";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

export function upsertDeckEntry(
  entries: DeckCardEntry[],
  card: YugiohCard
): DeckCardEntry[] {
  const existing = entries.find((e) => e.card.id === card.id);
  if (existing) {
    return entries.map((e) =>
      e.card.id === card.id ? { ...e, quantity: e.quantity + 1 } : e
    );
  }
  return [...entries, { card, quantity: 1 }];
}

export function removeOneDeckEntry(
  entries: DeckCardEntry[],
  cardId: number
): DeckCardEntry[] {
  return entries
    .map((e) => (e.card.id === cardId ? { ...e, quantity: e.quantity - 1 } : e))
    .filter((e) => e.quantity > 0);
}

export function addCardToDeck(
  deck: Deck,
  card: YugiohCard,
  zone?: DeckZone
): { deck: Deck; ok: true } | { deck: Deck; ok: false; reason?: string } {
  const targetZone = zone ?? getDefaultZoneForCard(card);
  const check = canAddCardToZone(deck, card, targetZone);
  if (!check.ok) {
    return { deck, ok: false, reason: check.reason };
  }
  return {
    deck: {
      ...deck,
      [targetZone]: upsertDeckEntry(deck[targetZone], card),
    },
    ok: true,
  };
}

export function removeCardFromDeck(deck: Deck, cardId: number, zone: DeckZone): Deck {
  return {
    ...deck,
    [zone]: removeOneDeckEntry(deck[zone], cardId),
  };
}

export function moveCardInDeck(
  deck: Deck,
  cardId: number,
  from: DeckZone,
  to: DeckZone
): Deck {
  const entry = deck[from].find((e) => e.card.id === cardId);
  if (!entry) return deck;

  const check = canAddCardToZone(deck, entry.card, to);
  if (!check.ok) return deck;

  return {
    ...deck,
    [from]: removeOneDeckEntry(deck[from], cardId),
    [to]: upsertDeckEntry(deck[to], entry.card),
  };
}
