import type { Card } from "@/features/cards/cards.schema";

export function getCardImageUrl(card: Card, size: "small" | "full" = "small"): string {
  const image = card.images[0];
  if (image) return size === "small" ? image.imageUrlSmall : image.imageUrl;
  if (card.id > 0) {
    const folder = size === "small" ? "cards_small" : "cards";
    return `https://images.ygoprodeck.com/images/${folder}/${card.id}.jpg`;
  }
  return "";
}

export function getCardTypeLabel(card: Card): string {
  if (card.type.includes("Monster")) return "Monster";
  if (card.type.includes("Spell")) return "Spell";
  if (card.type.includes("Trap")) return "Trap";
  return card.type;
}

const EXTRA_FRAMES = new Set([
  "fusion",
  "synchro",
  "xyz",
  "link",
  "fusion_pendulum",
  "synchro_pendulum",
  "xyz_pendulum",
]);

export function isExtraDeckCard(card: Card): boolean {
  if (EXTRA_FRAMES.has(card.frameType)) return true;
  return /Fusion|Synchro|Xyz|Link/i.test(card.type);
}
