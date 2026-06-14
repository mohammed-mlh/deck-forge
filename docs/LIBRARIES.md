# Library Reference (`src/lib`)

Pure TypeScript modules — no React unless noted. Safe to import from hooks, components, server code, and tests.

**YGOProDeck client:** `@/lib/ygoprodeck-sdk` (legacy re-export: `@/lib/ygoprodeck`)  
**Deck I/O barrel:** `@/lib/deck-io`

---

## Overview

```
lib/
├── utils.ts                 # cn() — clsx + tailwind-merge
├── ygoprodeck-sdk.ts        # YGOProDeck API client + React Query options
├── ygoprodeck.ts            # Deprecated re-export of ygoprodeck-sdk
├── card-filters.ts          # Filter state → API params + client sort
├── deck-rules.ts            # Zone rules, validation, deckFromRefs
├── deck-slots.ts            # Expand entries → grid slots for zone UI
├── deck-preview.ts          # Featured monster art for deck cards
├── deck-export.ts           # Deprecated shim → deck-io
├── clerk-appearance.ts      # Clerk theme tokens
├── site-metadata.ts         # Page metadata helpers
├── analytics.ts             # Client event tracking stub
├── auth/
│   ├── require-user.ts      # Clerk userId for API routes
│   └── rate-limit.ts        # In-memory AI rate limits
├── decks/
│   ├── deck-editor.ts       # add/remove/move card mutations
│   ├── deck-hydration.ts    # Stub refs → full YugiohCard via API
│   ├── deck-metadata.ts     # OG/Twitter metadata for deck pages
│   └── apply-deck-doctor.ts # Apply AI doctor suggestions to deck
├── ai/                      # Deck analysis + Deck Doctor (DeepSeek/mock)
└── deck-io/
    ├── index.ts
    ├── formats.ts
    ├── parse.ts
    ├── export.ts
    ├── resolve.ts
    └── __tests__/
```

**Persistence lives in** `src/features/decks/` (service, repository, mapper) + `src/db/`, not in `lib/`.

---

## `ygoprodeck-sdk.ts`

YGOProDeck API v7.

| Export | Description |
|--------|-------------|
| `INITIAL_BROWSE_PARAMS` | `{ type: "all", num: 100, offset: 0 }` |
| `buildCardQueryParams` | Merge search + filters; strip pagination when filtering |
| `buildCardSearchUrl` | Full cardinfo URL |
| `fetchCards(params)` | Filtered/paginated fetch; 5min in-memory cache |
| `fetchCardsByIds(ids)` | Bulk ID lookup in chunks of 80; throws on HTTP error |
| `fetchArchetypes()` | Archetype names from `archetypes.php` |
| `archetypesQuery` | TanStack `queryOptions` for archetype datalist |
| `getCardImageUrl`, `getCardTypeLabel`, `isExtraDeckCard` | Card helpers |

Import via `@/lib/ygoprodeck-sdk` or `@/lib/ygoprodeck`.

---

## `card-filters.ts`

| Function | Description |
|----------|-------------|
| `filtersNeedApi(search, filters)` | Hit YGOProDeck when search or any filter active |
| `filtersToApiParams(search, filters)` | `CardFilters` → `CardSearchParams` |
| `finalizeCards(cards, filters)` | Client type filter + sort |
| `toggleInList` | Checkbox list helper |

Constants: `DEFAULT_CARD_FILTERS`, `MONSTER_FRAMES`, `LINK_MARKERS`, `SPELL_RACES`, `TRAP_RACES`, `MONSTER_RACES`, `FILTER_BOUNDS`.

Idle browse uses paginated `fetchCards` (100 cards), not the full catalog.

---

## `deck-rules.ts`

Zone limits, copy limits, extra-deck placement, `validateDeck`, `validateDeckRefs`, `deckFromRefs` (for server validation with hydrated cards), `createEmptyDeck`.

---

## `decks/deck-editor.ts`

Pure deck mutations: `addCardToDeck`, `removeCardFromDeck`, `moveCardInDeck` — returns `{ ok, reason? }` on rule violations.

---

## `decks/deck-hydration.ts`

`hydrateDeck(deck)` — fetches full card data for stub entries via `fetchCardsByIds`.

---

## `deck-io/`

### `resolve.ts`

- ID refs → `fetchCardsByIds`
- Name refs → `fetchCards({ name })` per unique name
- JSON full import skips API (`tryImportJsonFullDeck`)

### Other modules

Same as before: `parse.ts` (10 formats), `export.ts`, `formats.ts`, `index.ts` barrel.

Tests: `pnpm test` — `src/lib/deck-io/__tests__/deck-io.test.ts`

---

## Module dependency graph

```
hooks / components / features / app/api
       ↓
card-filters ──→ ygoprodeck-sdk
deck-rules   ──→ ygoprodeck-sdk
deck-io/resolve ──→ ygoprodeck-sdk
decks/*      ──→ deck-rules, ygoprodeck-sdk
ai/*         ──→ deck-rules, types
       ↓
types/
```

---

## Related

- [CODEBASE.md](./CODEBASE.md) — folder structure and data flow
- [PROJECT.md](../PROJECT.md) — feature overview
