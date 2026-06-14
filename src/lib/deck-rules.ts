import type { Deck, DeckCardEntry, DeckValidationIssue, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import type { DeckZoneRefs } from "@/features/decks/decks.schema";
import type { YugiohCard } from "@/types/yugioh";
import { isExtraDeckCard } from "@/lib/ygoprodeck";

function countRefs(refs: DeckZoneRefs): number {
  return refs.reduce((sum, ref) => sum + ref.quantity, 0);
}

function countRefInZones(
  main: DeckZoneRefs,
  extra: DeckZoneRefs,
  side: DeckZoneRefs,
  cardId: number
): number {
  const zones = [main, extra, side];
  return zones.reduce((total, refs) => {
    const ref = refs.find((r) => r.id === cardId);
    return total + (ref?.quantity ?? 0);
  }, 0);
}

export function validateDeckRefs(
  main: DeckZoneRefs,
  extra: DeckZoneRefs,
  side: DeckZoneRefs
): DeckValidationIssue[] {
  const issues: DeckValidationIssue[] = [];
  const mainCount = countRefs(main);
  const extraCount = countRefs(extra);
  const sideCount = countRefs(side);

  if (mainCount > DECK_LIMITS.main.max) {
    issues.push({
      zone: "main",
      message: `Main Deck exceeds ${DECK_LIMITS.main.max} cards`,
      severity: "error",
    });
  }
  if (extraCount > DECK_LIMITS.extra.max) {
    issues.push({
      zone: "extra",
      message: `Extra Deck exceeds ${DECK_LIMITS.extra.max} cards`,
      severity: "error",
    });
  }
  if (sideCount > DECK_LIMITS.side.max) {
    issues.push({
      zone: "side",
      message: `Side Deck exceeds ${DECK_LIMITS.side.max} cards`,
      severity: "error",
    });
  }

  const seen = new Set<number>();
  for (const refs of [main, extra, side]) {
    for (const ref of refs) {
      if (seen.has(ref.id)) continue;
      seen.add(ref.id);
      const total = countRefInZones(main, extra, side, ref.id);
      if (total > DECK_LIMITS.maxCopies) {
        issues.push({
          cardId: ref.id,
          message: `Card ${ref.id}: ${total} copies (max ${DECK_LIMITS.maxCopies})`,
          severity: "error",
        });
      }
    }
  }

  return issues;
}

export function countZone(entries: DeckCardEntry[]): number {
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

export function countCardInDeck(deck: Deck, cardId: number): number {
  const zones: DeckZone[] = ["main", "extra", "side"];
  return zones.reduce((total, zone) => {
    const entry = deck[zone].find((e) => e.card.id === cardId);
    return total + (entry?.quantity ?? 0);
  }, 0);
}

export function getDefaultZoneForCard(card: YugiohCard): DeckZone {
  return isExtraDeckCard(card) ? "extra" : "main";
}

export function canAddCardToZone(
  deck: Deck,
  card: YugiohCard,
  zone: DeckZone
): { ok: boolean; reason?: string } {
  const totalCopies = countCardInDeck(deck, card.id);
  if (totalCopies >= DECK_LIMITS.maxCopies) {
    return { ok: false, reason: `Max ${DECK_LIMITS.maxCopies} copies per card` };
  }

  const isExtra = isExtraDeckCard(card);
  if (zone === "extra" && !isExtra) {
    return { ok: false, reason: "Only Extra Deck monsters go in Extra Deck" };
  }
  if ((zone === "main" || zone === "side") && isExtra) {
    return { ok: false, reason: "Extra Deck monsters must go in Extra Deck" };
  }

  const zoneCount = countZone(deck[zone]);
  if (zoneCount >= DECK_LIMITS[zone].max) {
    return { ok: false, reason: `${zone} deck is full` };
  }

  return { ok: true };
}

export function validateDeck(deck: Deck): DeckValidationIssue[] {
  const issues: DeckValidationIssue[] = [];
  const mainCount = countZone(deck.main);
  const extraCount = countZone(deck.extra);
  const sideCount = countZone(deck.side);

  if (mainCount < DECK_LIMITS.main.min) {
    issues.push({
      zone: "main",
      message: `Main Deck needs at least ${DECK_LIMITS.main.min} cards (${mainCount}/${DECK_LIMITS.main.min})`,
      severity: "warning",
    });
  }
  if (mainCount > DECK_LIMITS.main.max) {
    issues.push({
      zone: "main",
      message: `Main Deck exceeds ${DECK_LIMITS.main.max} cards`,
      severity: "error",
    });
  }
  if (extraCount > DECK_LIMITS.extra.max) {
    issues.push({
      zone: "extra",
      message: `Extra Deck exceeds ${DECK_LIMITS.extra.max} cards`,
      severity: "error",
    });
  }
  if (sideCount > DECK_LIMITS.side.max) {
    issues.push({
      zone: "side",
      message: `Side Deck exceeds ${DECK_LIMITS.side.max} cards`,
      severity: "error",
    });
  }

  const seen = new Set<number>();
  const zones: DeckZone[] = ["main", "extra", "side"];
  for (const zone of zones) {
    for (const entry of deck[zone]) {
      if (seen.has(entry.card.id)) continue;
      seen.add(entry.card.id);
      const total = countCardInDeck(deck, entry.card.id);
      if (total > DECK_LIMITS.maxCopies) {
        issues.push({
          cardId: entry.card.id,
          message: `${entry.card.name}: ${total} copies (max ${DECK_LIMITS.maxCopies})`,
          severity: "error",
        });
      }
    }
  }

  return issues;
}

export function createEmptyDeck(name = "New Deck"): Deck {
  return {
    id: crypto.randomUUID(),
    name,
    main: [],
    extra: [],
    side: [],
  };
}
