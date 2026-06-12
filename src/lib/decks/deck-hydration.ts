import { fetchCardsByIds } from "@/lib/ygoprodeck";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

const ZONES: DeckZone[] = ["main", "extra", "side"];

function isPartialCard(card: YugiohCard): boolean {
  return !card.desc?.trim();
}

export function deckNeedsHydration(deck: Deck): boolean {
  return ZONES.some((zone) => deck[zone].some((entry) => isPartialCard(entry.card)));
}

function collectCardIds(deck: Deck): number[] {
  const ids = new Set<number>();
  for (const zone of ZONES) {
    for (const entry of deck[zone]) {
      ids.add(entry.card.id);
    }
  }
  return [...ids];
}

function hydrateEntries(
  entries: DeckCardEntry[],
  byId: Map<number, YugiohCard>
): DeckCardEntry[] {
  return entries.map((entry) => {
    const full = byId.get(entry.card.id);
    return full ? { ...entry, card: full } : entry;
  });
}

export async function hydrateDeck(deck: Deck): Promise<Deck> {
  if (!deckNeedsHydration(deck)) return deck;

  const ids = collectCardIds(deck);
  if (ids.length === 0) return deck;

  const cards = await fetchCardsByIds(ids);
  const byId = new Map(cards.map((card) => [card.id, card]));

  return {
    ...deck,
    main: hydrateEntries(deck.main, byId),
    extra: hydrateEntries(deck.extra, byId),
    side: hydrateEntries(deck.side, byId),
  };
}
