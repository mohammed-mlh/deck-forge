# Phase 2 — AI Deck Context (current)

Future-proof `DeckContext` for AI analysis. No UI, no model calls, no changes to builder/storage/import/public decks.

## What changed from Step 1

| Before | After |
|--------|-------|
| `archetypeGuess: string \| null` | `archetype: { name, confidence }` |
| — | `identity: { archetype, playstyle }` |
| — | `averageMonsterStats: { atk, def, level }` |
| `rawCards` without quantity | `rawCards` with `quantity` (summed per card id) |

`analyzeDeck()` unchanged — still returns empty mock.

---

## Files

| File | Role |
|------|------|
| `src/lib/ai/types.ts` | All AI schemas |
| `src/lib/ai/deck-context.ts` | `buildDeckContext()` transform |
| `src/lib/ai/analyze-deck.ts` | Mock analysis (unchanged) |
| `src/types/deck.ts` | Optional `deck.archetype` fallback for prebuilts |

---

## `DeckContext` shape

```ts
{
  name: string;
  archetype: { name: string | null; confidence: number };
  identity: { archetype: string | null; playstyle: string | null };
  stats: { mainSize, extraSize, sideSize };
  typeDistribution: { monsters, spells, traps };
  monsterBreakdown: { normal, effect, fusion, synchro, xyz, link, pendulum };
  averageMonsterStats: { atk, def, level };
  keyCards: [{ name, count }];
  consistencySignals: { duplicatesOver3, under40Main, extraDeckOverfilled };
  rawCards: [{ id, name, quantity, type, race, attribute }];
}
```

### Example

```ts
{
  name: "Blue-Eyes Chronicle",
  archetype: { name: "Blue-Eyes", confidence: 0.48 },
  identity: { archetype: "Blue-Eyes", playstyle: null },
  stats: { mainSize: 37, extraSize: 9, sideSize: 15 },
  typeDistribution: { monsters: 31, spells: 24, traps: 6 },
  monsterBreakdown: { normal: 3, effect: 20, fusion: 3, synchro: 2, xyz: 2, link: 1, pendulum: 0 },
  averageMonsterStats: { atk: 2135, def: 1580, level: 4.7 },
  keyCards: [{ name: "Blue-Eyes White Dragon", count: 3 }],
  consistencySignals: { duplicatesOver3: [], under40Main: true, extraDeckOverfilled: false },
  rawCards: [{
    id: 89631139,
    name: "Blue-Eyes White Dragon",
    quantity: 3,
    type: "Monster",
    race: "Dragon",
    attribute: "LIGHT"
  }]
}
```

---

## Rules

### Archetype + confidence

1. Count `card.archetype` from API, weighted by `quantity`
2. `confidence = topArchetypeCopies / totalDeckCopies` (0–1, rounded to 2 decimals)
3. If `confidence >= 0.25` → `{ name: topArchetype, confidence }`
4. Else → `{ name: null, confidence: 0 }`
5. Fallback: if no detection but `deck.archetype` is set → `{ name: deck.archetype, confidence: 0 }`

### Identity

- `identity.archetype` = resolved `archetype.name`
- `identity.playstyle` = `null` (reserved for later)

### Raw cards

- One entry per unique card `id`
- `quantity` summed across main / extra / side
- Normalized: trimmed name, `Monster`/`Spell`/`Trap` type, no UI fields

### Average monster stats

- Monsters only, weighted by quantity
- Missing atk/def/level skipped per stat
- Level uses `level` → `rank` → `linkval`
- `atk`/`def` rounded to integers; `level` to 1 decimal
- `null` when no valid values for that stat

---

## Usage

```ts
import { buildDeckContext } from "@/lib/ai/deck-context";
import { analyzeDeck } from "@/lib/ai/analyze-deck";

// User / builder deck (API cards carry card.archetype)
const context = buildDeckContext(savedDeck);

// Public / prebuilt deck (pass deck-level label as fallback)
const context = buildDeckContext({
  id: publicDeck.id,
  name: publicDeck.name,
  main: publicDeck.main,
  extra: publicDeck.extra,
  side: publicDeck.side,
  archetype: publicDeck.archetype,
});

const analysis = analyzeDeck(context); // mock empty response
```

---

## Full source

### `src/lib/ai/types.ts`

```ts
export interface DeckContextStats {
  mainSize: number;
  extraSize: number;
  sideSize: number;
}

export interface TypeDistribution {
  monsters: number;
  spells: number;
  traps: number;
}

export interface MonsterBreakdown {
  normal: number;
  effect: number;
  fusion: number;
  synchro: number;
  xyz: number;
  link: number;
  pendulum: number;
}

export interface KeyCard {
  name: string;
  count: number;
}

export interface ConsistencySignals {
  duplicatesOver3: string[];
  under40Main: boolean;
  extraDeckOverfilled: boolean;
}

export interface DeckArchetype {
  name: string | null;
  confidence: number;
}

export interface AverageMonsterStats {
  atk: number | null;
  def: number | null;
  level: number | null;
}

export interface DeckIdentity {
  archetype: string | null;
  playstyle: string | null;
}

export interface RawDeckCard {
  id: number;
  name: string;
  quantity: number;
  type: string;
  race: string | null;
  attribute: string | null;
}

export interface DeckContext {
  name: string;
  archetype: DeckArchetype;
  identity: DeckIdentity;
  stats: DeckContextStats;
  typeDistribution: TypeDistribution;
  monsterBreakdown: MonsterBreakdown;
  averageMonsterStats: AverageMonsterStats;
  keyCards: KeyCard[];
  consistencySignals: ConsistencySignals;
  rawCards: RawDeckCard[];
}

export interface DeckStrength {
  description: string;
}

export interface DeckWeakness {
  description: string;
}

export interface DeckSuggestion {
  description: string;
}

export interface DeckAnalysis {
  summary: string;
  strengths: DeckStrength[];
  weaknesses: DeckWeakness[];
  suggestions: DeckSuggestion[];
}
```

### `src/lib/ai/deck-context.ts`

```ts
import { countZone } from "@/lib/deck-rules";
import { getCardTypeLabel } from "@/lib/ygoprodeck";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";
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

function normalizeCardType(card: YugiohCard): string {
  return getCardTypeLabel(card);
}

function normalizeRawCard(card: YugiohCard): Omit<RawDeckCard, "quantity"> {
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

function getMonsterLevel(card: YugiohCard): number | undefined {
  if (card.level !== undefined) return card.level;
  if (card.rank !== undefined) return card.rank;
  if (card.linkval !== undefined) return card.linkval;
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

    if (atk !== undefined) {
      atkSum += atk * quantity;
      atkWeight += quantity;
    }
    if (def !== undefined) {
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
```

### `src/lib/ai/analyze-deck.ts`

```ts
import type { DeckAnalysis, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";

const MOCK_DECK_ANALYSIS: DeckAnalysis = {
  summary: "",
  strengths: [],
  weaknesses: [],
  suggestions: [],
};

export function analyzeDeck(_input: Deck | DeckContext): DeckAnalysis {
  return MOCK_DECK_ANALYSIS;
}
```

### `src/types/deck.ts` (AI-related addition only)

```ts
export interface Deck {
  id: string;
  name: string;
  main: DeckCardEntry[];
  extra: DeckCardEntry[];
  side: DeckCardEntry[];
  /** Deck label fallback when cards lack API archetype data. */
  archetype?: string;
}
```

---

## Not changed

- `analyzeDeck()` behavior
- Deck builder, storage, import/export
- Public deck definitions in `public-decks.ts`
- UI

---

## Next steps (out of scope)

- Wire `buildDeckContext` into deck builder UI
- Replace mock `analyzeDeck` with real AI provider
- Implement `identity.playstyle` detection
