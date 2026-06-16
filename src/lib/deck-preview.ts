import type { Deck, DeckCardEntry } from "@/features/decks/decks.schema";
import type { Card } from "@/features/cards/cards.schema";

function normalizeAtk(atk: number | null | undefined): number {
  if (atk === undefined || atk === null || atk === -1) return 0;
  return atk;
}

function collectMonsters(entries: DeckCardEntry[]): Card[] {
  return entries
    .filter((e) => e.card.type.includes("Monster"))
    .flatMap((e) => Array.from({ length: e.quantity }, () => e.card));
}

/** Highest-ATK monster, or first card with art when stubs lack type/atk. */
export function getFeaturedCard(deck: Deck): Card | null {
  const monsters = [
    ...collectMonsters(deck.main),
    ...collectMonsters(deck.extra),
    ...collectMonsters(deck.side),
  ];

  if (monsters.length > 0) {
    return monsters.reduce((best, card) =>
      normalizeAtk(card.atk) > normalizeAtk(best.atk) ? card : best
    );
  }

  for (const zone of ["extra", "main", "side"] as const) {
    for (const entry of deck[zone]) {
      if (entry.card.images[0]) return entry.card;
    }
  }

  return null;
}

export function getCardArtUrl(card: Card): string {
  const image = card.images[0];
  if (!image) return "";
  return image.imageUrlCropped || image.imageUrl;
}
