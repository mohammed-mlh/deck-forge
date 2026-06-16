import type { Deck } from "@/features/decks/decks.schema";

export function isDeckPayload(value: unknown): value is Deck {
  if (!value || typeof value !== "object") return false;
  const deck = value as Deck;
  return (
    typeof deck.id === "string" &&
    typeof deck.name === "string" &&
    Array.isArray(deck.main) &&
    Array.isArray(deck.extra) &&
    Array.isArray(deck.side)
  );
}
