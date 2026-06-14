import type { Deck, DeckCardEntry } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

function normalizeAtk(atk: number | undefined): number {
  if (atk === undefined || atk === -1) return 0;
  return atk;
}

function collectMonsters(entries: DeckCardEntry[]): YugiohCard[] {
  return entries
    .filter((e) => e.card.type.includes("Monster"))
    .flatMap((e) => Array.from({ length: e.quantity }, () => e.card));
}

/** Highest-ATK monster, or first card with art when stubs lack type/atk. */
export function getFeaturedCard(deck: Deck): YugiohCard | null {
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
      if (entry.card.card_images[0]) return entry.card;
    }
  }

  return null;
}

export function getCardArtUrl(card: YugiohCard): string {
  const image = card.card_images[0];
  if (!image) return "";
  return image.image_url_cropped || image.image_url;
}
