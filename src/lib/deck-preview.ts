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

export function getMostPowerfulMonster(deck: Deck): YugiohCard | null {
  const monsters = [
    ...collectMonsters(deck.main),
    ...collectMonsters(deck.extra),
    ...collectMonsters(deck.side),
  ];

  if (monsters.length === 0) return null;

  return monsters.reduce((best, card) =>
    normalizeAtk(card.atk) > normalizeAtk(best.atk) ? card : best
  );
}

export function getCardArtUrl(card: YugiohCard): string {
  const image = card.card_images[0];
  if (!image) return "";
  return image.image_url_cropped || image.image_url;
}
