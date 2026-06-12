# Library Reference (`src/lib`)

Pure TypeScript modules — no React. Safe to import from hooks, components, and tests.

**Barrel import for deck I/O:** `@/lib/deck-io`  
**Everything else:** import from the specific file.

---

## Overview

```
lib/
├── utils.ts              # cn() — clsx + tailwind-merge
├── ygoprodeck.ts         # YGOProDeck API client
├── card-filters.ts       # Filter state → API params + client sort
├── deck-rules.ts         # Zone rules, validation, empty deck factory
├── deck-storage.ts       # localStorage CRUD for saved decks
├── deck-slots.ts         # Expand entries → grid slots for zone UI
├── deck-preview.ts       # Featured monster art for deck cards
├── deck-export.ts        # Deprecated shim → deck-io
├── dummy-users.ts        # Demo auth accounts
├── prebuilt-decks.ts     # Static 12 prebuilt deck definitions
└── deck-io/
    ├── index.ts          # Public exports
    ├── formats.ts        # Format metadata registry
    ├── parse.ts          # Import parsers + auto-detect
    ├── export.ts         # Export serializers + download
    ├── resolve.ts        # Name/ID → YugiohCard resolution
    └── __tests__/        # Vitest suite
```

---

## `utils.ts`

```ts
cn(...inputs: ClassValue[]): string
```

Merges Tailwind classes with conflict resolution (`clsx` + `tailwind-merge`).

---

## `ygoprodeck.ts`

YGOProDeck API v7 client. Base URL: `https://db.ygoprodeck.com/api/v7/cardinfo.php`

### Constants

| Export | Value | Purpose |
|--------|-------|---------|
| `INITIAL_BROWSE_PARAMS` | `{ type: "all", num: 100, offset: 0 }` | Default paginated browse |
| `INITIAL_CARD_COUNT` | `100` | Slice size for idle browse |
| `allCardsQuery` | TanStack `queryOptions` | Full card pool (1hr stale) |

### Query building

| Function | Description |
|----------|-------------|
| `hasServerCardFilters(params)` | True if any param requires filtered API call (drops pagination) |
| `buildCardQueryParams(search, params)` | Merges search string; strips `num`/`offset` when filtering |
| `buildCardSearchUrl(params)` | Full URL with `fname`, `attribute`, `frameType`, bounded ranges, etc. |

**Range params** use `gte` / `lte` suffixes: `atk=gte2000`, `level=lte8`.

**Important:** When filters or search are active, `num` and `offset` are omitted — YGOProDeck returns all matches (can be large).

### Fetching

| Function | Description |
|----------|-------------|
| `fetchCards(params)` | Filtered/paginated fetch; 5min in-memory cache per param key |
| `fetchCardsByIds(ids)` | Bulk ID lookup in chunks of 80 |
| `fetchAllCards()` | Entire database; singleton promise cache |

### Card helpers

| Function | Description |
|----------|-------------|
| `getCardImageUrl(card, size?)` | `"small"` → `image_url_small`, `"full"` → `image_url` |
| `getCardTypeLabel(card)` | `"Monster"` / `"Spell"` / `"Trap"` |
| `isExtraDeckCard(card)` | Fusion, Synchro, XYZ, Link (+ pendulum variants) |
| `extractArchetypes(cards, limit?)` | Sorted unique archetypes for datalists |

---

## `card-filters.ts`

Single source of truth for card filter state and API mapping.

### Types

```ts
interface CardFilters {
  type: "all" | "monster" | "spell" | "trap"
  attribute?: string
  archetype?: string
  frames: string[]           // frameType values for API
  linkMarkers: string[]      // linkmarker API param
  monsterRace: string
  spellRace: string
  trapRace: string
  hasEffect: boolean
  levelMin/Max, atkMin/Max, defMin/Max, linkMin/Max, scaleMin/Max: number
  sort: "name" | "atk-desc" | "def-desc" | "level-desc"
}
```

### Constants

- `DEFAULT_CARD_FILTERS` — all ranges at full bounds, empty arrays
- `MONSTER_FRAMES`, `LINK_MARKERS`, `SPELL_RACES`, `TRAP_RACES`
- `FILTER_BOUNDS` — min/max for each range slider

### Functions

| Function | Description |
|----------|-------------|
| `filtersNeedApi(search, filters)` | Should we hit API instead of local pool? |
| `filtersUseMonsterPool(search, filters)` | Monster-only with no API filters → use full pool |
| `filtersToApiParams(search, filters)` | `CardFilters` → `CardSearchParams` |
| `filterCardsByType(cards, type)` | Client-side type filter |
| `finalizeCards(cards, filters)` | Type filter + sort (post-fetch) |
| `extractMonsterRaces(cards, limit?)` | Race datalist for filter panel |
| `toggleInList(values, value)` | Checkbox list helper |

### Design rule

**API-first:** ranges, attribute, archetype, frames, race, etc. go to YGOProDeck.  
**Client-only:** `type` when browsing monster pool without API filters; `sort` always client-side.

---

## `deck-rules.ts`

Yu-Gi-Oh deck construction rules.

### Constants (from `types/deck.ts`)

```ts
DECK_LIMITS = {
  main: { min: 40, max: 60 },
  extra: { min: 0, max: 15 },
  side: { min: 0, max: 15 },
  maxCopies: 3,
}
```

### Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `countZone(entries)` | `number` | Total cards in a zone |
| `countCardInDeck(deck, cardId)` | `number` | Copies across all zones |
| `getDefaultZoneForCard(card)` | `DeckZone` | `"extra"` or `"main"` |
| `canAddCardToZone(deck, card, zone)` | `{ ok, reason? }` | Pre-add validation |
| `validateDeck(deck)` | `DeckValidationIssue[]` | Zone size + copy limit issues |
| `createEmptyDeck(name?)` | `Deck` | New UUID deck |

Used by `useDeck` before mutating state.

---

## `deck-storage.ts`

Browser persistence for user decks.

| Function | Description |
|----------|-------------|
| `loadDecks()` | Read all from `localStorage["deck-forge:decks"]` |
| `getDeckById(id)` | Single deck lookup |
| `saveDeck(deck)` | Upsert by `deck.id`, sets `updatedAt` |
| `deleteDeck(id)` | Remove from array |

SSR-safe: returns `[]` when `window` undefined.  
No schema validation on read — corrupt JSON → `[]`.

---

## `deck-slots.ts`

Expands `DeckCardEntry[]` into individual slots for the 10-column zone grid.

| Export | Description |
|--------|-------------|
| `DECK_GRID_COLUMNS` | `10` |
| `entriesToSlots(entries)` | `{ entry, copyIndex }[]` — one slot per physical card |
| `buildSlotGrid(filled, capacity)` | Pad with `null` to fixed capacity |

---

## `deck-preview.ts`

Deck list / browse card thumbnails.

| Function | Description |
|----------|-------------|
| `getMostPowerfulMonster(deck)` | Highest ATK monster across all zones |
| `getCardArtUrl(card)` | Cropped image URL for backgrounds |

---

## `dummy-users.ts`

| Export | Description |
|--------|-------------|
| `DUMMY_ACCOUNTS` | Two demo users with passwords |
| `DEFAULT_DUMMY_ACCOUNT` | `duelist@deckforge.com` |
| `findDummyAccount(email)` | Case-insensitive lookup |

---

## `prebuilt-decks.ts`

Static data module — 12 `PrebuiltDeck` objects.

### Internal helpers

- `CardDef` tuple: `[id, name, type, qty, atk?]`
- `entries(defs)` — builds `DeckCardEntry[]` with minimal `YugiohCard` stubs (enough for images/names)

### Public API

| Function | Description |
|----------|-------------|
| `getPrebuiltDecks()` | All decks sorted |
| `getPrebuiltDeck(id)` | Single deck by `id` slug |

Card images resolved at render time via YGOProDeck CDN using card IDs.

---

## `deck-export.ts`

**Deprecated** — re-exports from `deck-io` for backward compatibility.

```ts
downloadDeckTxt(deck)  // → downloadDeckExport(deck, "ygoprodeck-txt")
```

---

## `deck-io/` — Import / Export

### `formats.ts`

`DECK_FORMATS` — array of 10 format definitions (`id`, `label`, `extension`, `mimeType`, `importable`, `exportable`).

`getDeckFormat(id)` — lookup by `DeckFormatId`.

### `parse.ts`

**Intermediate type:**

```ts
interface ParsedDeckList {
  name?: string
  main/extra/side: ParsedCardRef[]  // { id?, name?, quantity }
}
```

| Function | Input format |
|----------|--------------|
| `parseYgoprodeckTxt` | `#main` / `#extra` / `!side` + names |
| `parseYdk` | Same sections + numeric IDs |
| `parseYdke` | `ydke://base64!base64!base64` |
| `parseJsonPortable` | `{ main: [{ id, quantity }] }` |
| `parseJsonFull` | DeckForge `Deck` JSON with embedded cards |
| `parseCsv` / `parseTsv` | `zone,id,name,quantity` |
| `parseXml` | `<deck><main><card id="" qty=""/></main>` |
| `parsePlainIds` | Comma/newline IDs → main only |
| `parsePlainNames` | One name per line → main only |

| Function | Description |
|----------|-------------|
| `detectDeckFormat(content, filename?)` | Heuristic auto-detect |
| `parseDeckContent(content, format, filename?)` | Dispatch to parser |

Duplicate names/IDs in a zone are merged with summed quantities.

### `export.ts`

| Function | Output |
|----------|--------|
| `exportDeck(deck, format)` | String for any `DeckFormatId` |
| `exportDeckToTxt/Ydk/Ydke/...` | Format-specific serializers |
| `downloadDeckExport(deck, format)` | Trigger browser file download |

### `resolve.ts`

| Function | Description |
|----------|-------------|
| `resolveParsedDeck(parsed)` | `ParsedDeckList` → `ImportResult` with full `YugiohCard` entries |
| `tryImportJsonFullDeck(content)` | Fast path for native deck JSON (no API) |

Resolution order per ref:
1. By ID → `fetchCardsByIds` + full pool map
2. By name → case-insensitive match in full pool

Unresolved refs collected in `errors[]`; partial imports still succeed.

### `index.ts` — public barrel

```ts
export { DECK_FORMATS, getDeckFormat } from "./formats"
export { detectDeckFormat, parseDeckContent } from "./parse"
export { exportDeck, downloadDeckExport, ... } from "./export"
export { resolveParsedDeck, tryImportJsonFullDeck } from "./resolve"
```

---

## Module Dependency Graph

```
components/hooks
       ↓
┌──────┴──────────────────────────────────────┐
│  card-filters.ts ──→ ygoprodeck.ts          │
│  deck-rules.ts   ──→ ygoprodeck.ts          │
│  deck-storage.ts                            │
│  deck-io/resolve.ts ──→ ygoprodeck.ts       │
│  deck-io/parse.ts   (standalone)            │
│  deck-io/export.ts  (standalone)            │
│  prebuilt-decks.ts  (standalone)            │
│  deck-preview.ts    ──→ types only          │
│  deck-slots.ts      ──→ types only          │
└─────────────────────────────────────────────┘
       ↓
   types/
```

---

## Adding New Lib Code

1. **No React** in `lib/` — keep side effects explicit (fetch, localStorage)
2. **Export types** from `types/` when shared across layers
3. **Test parsers** in `__tests__/` with mocked API for resolve logic
4. **Barrel files** only when a folder has multiple public modules (`deck-io/index.ts`)

---

## Related

- [CODEBASE.md](./CODEBASE.md) — folder structure and data flow
- [PROJECT.md](../PROJECT.md) — feature overview
