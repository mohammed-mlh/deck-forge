# Phase 2 — Step 1: AI Deck Foundation

Foundation for future AI features (Deck Analysis, Deck Doctor, card explanations). No UI, no API calls, no model costs.

## Task mapping

| Task | File | What was done |
|------|------|----------------|
| **Task 5 — AI types** | `src/lib/ai/types.ts` | `DeckContext`, `DeckAnalysis`, `DeckStrength`, `DeckWeakness`, `DeckSuggestion` and supporting shapes |
| **Task 1 — Deck context generator** | `src/lib/ai/deck-context.ts` | `buildDeckContext(deck)` — pure transform from `Deck` → `DeckContext` |
| **Task 2 — Archetype detection** | `src/lib/ai/deck-context.ts` | `detectArchetype()` — counts `card.archetype` from API data; 25% threshold; deterministic |
| **Task 3 — Normalize deck data** | `src/lib/ai/deck-context.ts` | Normalized types/names, deduped `rawCards`, no UI fields in output |
| **Task 4 — Mock analysis** | `src/lib/ai/analyze-deck.ts` | `analyzeDeck()` returns static empty mock; no conditions |
| **Public deck fallback** | `src/types/deck.ts` | Optional `deck.archetype` when prebuilt cards lack API `card.archetype` |

## Usage

```ts
import { buildDeckContext } from "@/lib/ai/deck-context";
import { analyzeDeck } from "@/lib/ai/analyze-deck";

// User / builder deck (cards from API carry card.archetype)
const context = buildDeckContext(savedDeck);
const analysis = analyzeDeck(context);

// Public / prebuilt deck (pass deck-level label as fallback)
const context = buildDeckContext({
  id: publicDeck.id,
  name: publicDeck.name,
  main: publicDeck.main,
  extra: publicDeck.extra,
  side: publicDeck.side,
  archetype: publicDeck.archetype,
});
```

## Design decisions

- **Archetype:** Uses `card.archetype` from YGOProDeck API responses directly. No name-matching heuristics. Prebuilt public decks do not stamp fake archetypes on cards; `deck.archetype` is the fallback label.
- **Analysis:** `analyzeDeck` is a placeholder only. Real AI wiring comes in a later step.
- **Deterministic:** Same deck input always produces the same `DeckContext`.

---

## 1. `src/lib/ai/types.ts`

Defines the schema for AI-ready deck representation and future analysis responses.

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

export interface RawDeckCard {
  id: number;
  name: string;
  type: string;
  race: string | null;
  attribute: string | null;
}

export interface DeckContext {
  name: string;
  archetypeGuess: string | null;
  stats: DeckContextStats;
  typeDistribution: TypeDistribution;
  monsterBreakdown: MonsterBreakdown;
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

---

## 2. `src/lib/ai/deck-context.ts`

Pure transformation logic. No AI calls. Reuses `YugiohCard`, `countZone`, `getCardTypeLabel`, `DECK_LIMITS`.

**`buildDeckContext` output shape:**

```ts
{
  name: string,
  archetypeGuess: string | null,
  stats: { mainSize, extraSize, sideSize },
  typeDistribution: { monsters, spells, traps },
  monsterBreakdown: { normal, effect, fusion, synchro, xyz, link, pendulum },
  keyCards: [{ name, count }],
  consistencySignals: { duplicatesOver3, under40Main, extraDeckOverfilled },
  rawCards: [{ id, name, type, race, attribute }]
}
```

**Archetype rules (Task 2):**

- Count copies weighted by `quantity` using `card.archetype` from API
- Most common archetype wins if share ≥ 25%
- Otherwise `null`, unless `deck.archetype` fallback is set

```ts
import { countZone } from "@/lib/deck-rules";
import { getCardTypeLabel } from "@/lib/ygoprodeck";
import type { Deck, DeckCardEntry, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";
import type {
  ConsistencySignals,
  DeckContext,
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

function flattenEntries(deck: Deck): DeckCardEntry[] {
  return ZONES.flatMap((zone) => deck[zone]);
}

function normalizeCardName(name: string): string {
  return name.trim();
}

function normalizeCardType(card: YugiohCard): string {
  return getCardTypeLabel(card);
}

function normalizeRawCard(card: YugiohCard): RawDeckCard {
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

function detectArchetype(entries: DeckCardEntry[]): string | null {
  const totals = new Map<string, number>();
  let deckCards = 0;

  for (const entry of entries) {
    deckCards += entry.quantity;
    const archetype = entry.card.archetype?.trim() || null;
    if (!archetype) continue;
    totals.set(archetype, (totals.get(archetype) ?? 0) + entry.quantity);
  }

  if (deckCards === 0 || totals.size === 0) return null;

  const ranked = [...totals.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const [topArchetype, topCount] = ranked[0];
  if (topCount / deckCards >= ARCHETYPE_THRESHOLD) {
    return topArchetype;
  }

  return null;
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
    if (!byId.has(entry.card.id)) {
      byId.set(entry.card.id, normalizeRawCard(entry.card));
    }
  }

  return [...byId.values()].sort((a, b) => {
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return a.id - b.id;
  });
}

export function buildDeckContext(deck: Deck): DeckContext {
  const entries = flattenEntries(deck);

  return {
    name: deck.name.trim() || "Unnamed Deck",
    archetypeGuess: detectArchetype(entries) ?? deck.archetype ?? null,
    stats: {
      mainSize: countZone(deck.main),
      extraSize: countZone(deck.extra),
      sideSize: countZone(deck.side),
    },
    typeDistribution: buildTypeDistribution(entries),
    monsterBreakdown: buildMonsterBreakdown(entries),
    keyCards: buildKeyCards(entries),
    consistencySignals: buildConsistencySignals(deck, entries),
    rawCards: buildRawCards(entries),
  };
}
```

---

## 3. `src/lib/ai/analyze-deck.ts`

Mock analysis layer (Task 4). Accepts `Deck` or `DeckContext`. Always returns the same empty structure. Input is ignored until a real model is wired.

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

---

## 4. `src/types/deck.ts`

Shared deck type used by builder, storage, and AI context. Only change for Step 1: optional `archetype` fallback for public/prebuilt decks whose mock cards lack API `card.archetype`.

Not stored on user saved decks by default. `PublicDeck` already has a required `archetype` field; pass it when calling `buildDeckContext`.

```ts
import type { YugiohCard } from "@/types/yugioh";

export type DeckZone = "main" | "extra" | "side";

export interface DeckCardEntry {
  card: YugiohCard;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  main: DeckCardEntry[];
  extra: DeckCardEntry[];
  side: DeckCardEntry[];
  /** Deck label fallback when cards lack API archetype data. */
  archetype?: string;
}

export interface SavedDeck extends Deck {
  updatedAt: string;
}

export interface DeckValidationIssue {
  zone?: DeckZone;
  cardId?: number;
  message: string;
  severity: "error" | "warning";
}

export const DECK_LIMITS = {
  main: { min: 40, max: 60 },
  extra: { min: 0, max: 15 },
  side: { min: 0, max: 15 },
  maxCopies: 3,
} as const;
```

---

## File layout

```text
src/lib/ai/
├── types.ts
├── deck-context.ts
├── analyze-deck.ts
└── PHASE-2-STEP-1.md   ← this file

src/types/
└── deck.ts             ← optional archetype fallback
```

## Not in scope (Step 1)

- UI (Improve Deck button, chatbot)
- OpenAI / model integration
- Changes to deck rules, API routes, or storage logic
