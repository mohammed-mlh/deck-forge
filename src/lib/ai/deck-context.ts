import { countZone } from "@/lib/deck-rules";
import { getCardTypeLabel } from "@/lib/cards";
import type { Deck, DeckCardEntry, DeckZone } from "@/features/decks/decks.schema";
import { DECK_LIMITS } from "@/features/decks/decks.schema";
import type { Card } from "@/features/cards/cards.schema";
import type {
  AverageMonsterStats,
  ConsistencySignals,
  DeckArchetype,
  DeckContext,
  DeckIdentity,
  KeyCard,
  MonsterBreakdown,
  RawDeckCard,
  TypeDistribution,
} from "@/lib/ai/types";

const ARCHETYPE_THRESHOLD = 0.25;
const KEY_CARDS_LIMIT = 15;

const ZONES: DeckZone[] = ["main", "extra", "side"];

const EMPTY_MONSTER_BREAKDOWN = (): MonsterBreakdown => ({
  normal: 0,
  effect: 0,
  fusion: 0,
  synchro: 0,
  xyz: 0,
  link: 0,
  pendulum: 0,
});

const EMPTY_TYPE_DISTRIBUTION = (): TypeDistribution => ({
  monsters: 0,
  spells: 0,
  traps: 0,
});

const EMPTY_ARCHETYPE = (): DeckArchetype => ({
  name: null,
  confidence: 0,
});

function flattenEntries(deck: Deck): DeckCardEntry[] {
  return ZONES.flatMap((zone) => deck[zone]);
}

function normalizeCardName(name: string): string {
  return name.trim();
}

function normalizeCardType(card: Card): string {
  return getCardTypeLabel(card);
}

function normalizeRawCard(card: Card): Omit<RawDeckCard, "quantity"> {
  return {
    id: card.id,
    name: normalizeCardName(card.name),
    type: normalizeCardType(card),
    race: card.race?.trim() ?? null,
    attribute: card.attribute?.trim() ?? null,
  };
}

function classifyMonsterFrame(frameType: string): keyof MonsterBreakdown {
  const frame = frameType.toLowerCase();

  if (frame.includes("link")) return "link";
  if (frame.includes("xyz")) return "xyz";
  if (frame.includes("synchro")) return "synchro";
  if (frame.includes("fusion")) return "fusion";
  if (frame.includes("pendulum")) return "pendulum";
  if (frame === "normal") return "normal";

  return "effect";
}

function roundConfidence(value: number): number {
  return Math.round(value * 100) / 100;
}

function detectArchetype(entries: DeckCardEntry[]): DeckArchetype {
  const totals = new Map<string, number>();
  let deckCards = 0;

  for (const entry of entries) {
    deckCards += entry.quantity;
    const archetype = entry.card.archetype?.trim() || null;
    if (!archetype) continue;
    totals.set(archetype, (totals.get(archetype) ?? 0) + entry.quantity);
  }

  if (deckCards === 0 || totals.size === 0) {
    return EMPTY_ARCHETYPE();
  }

  const ranked = [...totals.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const [topArchetype, topCount] = ranked[0];
  const confidence = roundConfidence(topCount / deckCards);

  if (confidence >= ARCHETYPE_THRESHOLD) {
    return { name: topArchetype, confidence };
  }

  return EMPTY_ARCHETYPE();
}

function resolveArchetype(entries: DeckCardEntry[], deck: Deck): DeckArchetype {
  const detected = detectArchetype(entries);
  if (detected.name !== null) return detected;

  if (deck.archetype?.trim()) {
    return { name: deck.archetype.trim(), confidence: 0 };
  }

  return EMPTY_ARCHETYPE();
}

function getMonsterLevel(card: Card): number | undefined {
  if (card.level != null) return card.level;
  if (card.rank != null) return card.rank;
  if (card.linkval != null) return card.linkval;
  return undefined;
}

function buildAverageMonsterStats(entries: DeckCardEntry[]): AverageMonsterStats {
  let atkSum = 0;
  let atkWeight = 0;
  let defSum = 0;
  let defWeight = 0;
  let levelSum = 0;
  let levelWeight = 0;

  for (const entry of entries) {
    if (normalizeCardType(entry.card) !== "Monster") continue;

    const quantity = entry.quantity;
    const { atk, def } = entry.card;
    const level = getMonsterLevel(entry.card);

    if (atk != null) {
      atkSum += atk * quantity;
      atkWeight += quantity;
    }
    if (def != null) {
      defSum += def * quantity;
      defWeight += quantity;
    }
    if (level !== undefined) {
      levelSum += level * quantity;
      levelWeight += quantity;
    }
  }

  return {
    atk: atkWeight > 0 ? Math.round(atkSum / atkWeight) : null,
    def: defWeight > 0 ? Math.round(defSum / defWeight) : null,
    level: levelWeight > 0 ? Math.round((levelSum / levelWeight) * 10) / 10 : null,
  };
}

function buildTypeDistribution(entries: DeckCardEntry[]): TypeDistribution {
  const distribution = EMPTY_TYPE_DISTRIBUTION();

  for (const entry of entries) {
    const label = normalizeCardType(entry.card);
    if (label === "Monster") distribution.monsters += entry.quantity;
    else if (label === "Spell") distribution.spells += entry.quantity;
    else if (label === "Trap") distribution.traps += entry.quantity;
  }

  return distribution;
}

function buildMonsterBreakdown(entries: DeckCardEntry[]): MonsterBreakdown {
  const breakdown = EMPTY_MONSTER_BREAKDOWN();

  for (const entry of entries) {
    if (normalizeCardType(entry.card) !== "Monster") continue;
    const bucket = classifyMonsterFrame(entry.card.frameType);
    breakdown[bucket] += entry.quantity;
  }

  return breakdown;
}

function buildKeyCards(entries: DeckCardEntry[]): KeyCard[] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    const name = normalizeCardName(entry.card.name);
    counts.set(name, (counts.get(name) ?? 0) + entry.quantity);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    })
    .slice(0, KEY_CARDS_LIMIT);
}

function buildConsistencySignals(deck: Deck, entries: DeckCardEntry[]): ConsistencySignals {
  const mainSize = countZone(deck.main);
  const extraSize = countZone(deck.extra);
  const nameTotals = new Map<string, number>();

  for (const entry of entries) {
    const name = normalizeCardName(entry.card.name);
    nameTotals.set(name, (nameTotals.get(name) ?? 0) + entry.quantity);
  }

  const duplicatesOver3 = [...nameTotals.entries()]
    .filter(([, count]) => count > DECK_LIMITS.maxCopies)
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));

  return {
    duplicatesOver3,
    under40Main: mainSize < DECK_LIMITS.main.min,
    extraDeckOverfilled: extraSize > DECK_LIMITS.extra.max,
  };
}

function buildRawCards(entries: DeckCardEntry[]): RawDeckCard[] {
  const byId = new Map<number, RawDeckCard>();

  for (const entry of entries) {
    const existing = byId.get(entry.card.id);
    if (existing) {
      existing.quantity += entry.quantity;
      continue;
    }

    byId.set(entry.card.id, {
      ...normalizeRawCard(entry.card),
      quantity: entry.quantity,
    });
  }

  return [...byId.values()].sort((a, b) => {
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return a.id - b.id;
  });
}

function buildIdentity(archetype: DeckArchetype): DeckIdentity {
  return {
    archetype: archetype.name,
    playstyle: null,
  };
}

export function buildDeckContext(deck: Deck): DeckContext {
  const entries = flattenEntries(deck);
  const archetype = resolveArchetype(entries, deck);

  return {
    name: deck.name.trim() || "Unnamed Deck",
    archetype,
    identity: buildIdentity(archetype),
    stats: {
      mainSize: countZone(deck.main),
      extraSize: countZone(deck.extra),
      sideSize: countZone(deck.side),
    },
    typeDistribution: buildTypeDistribution(entries),
    monsterBreakdown: buildMonsterBreakdown(entries),
    averageMonsterStats: buildAverageMonsterStats(entries),
    keyCards: buildKeyCards(entries),
    consistencySignals: buildConsistencySignals(deck, entries),
    rawCards: buildRawCards(entries),
  };
}
