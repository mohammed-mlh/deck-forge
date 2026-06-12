# Codebase Guide

Developer reference for DeckForge source layout, conventions, and how pieces connect.

**Path alias:** `@/` → `src/`

---

## Repository Layout

```
deck-forge/
├── docs/                    # Documentation (this folder)
├── PROJECT.md               # Product / feature overview
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React UI (feature-grouped)
│   ├── hooks/               # Client state + data hooks
│   ├── lib/                 # Pure logic, API, parsers (see LIBRARIES.md)
│   ├── providers/           # React context providers
│   └── types/               # Shared TypeScript types
├── vitest.config.ts         # Unit test config
├── next.config.ts           # Redirects, image domains
└── package.json
```

---

## `src/app/` — Routes

Next.js 16 App Router. All pages share root `layout.tsx` → `SiteLayout` (navbar + footer).

```
app/
├── layout.tsx               # Root: fonts, QueryProvider, AuthProvider, SiteLayout
├── globals.css              # Design tokens, Tailwind v4 @theme
├── (marketing)/
│   ├── page.tsx             # / — landing
│   ├── cards/page.tsx       # /cards
│   ├── login/page.tsx       # /login
│   └── register/page.tsx    # /register
├── deck-builder/
│   ├── page.tsx             # /deck-builder — new deck
│   └── [id]/page.tsx        # /deck-builder/:id — load saved deck
├── decks/page.tsx           # /decks — my saved decks
└── browse-decks/
    ├── page.tsx             # /browse-decks
    └── [id]/page.tsx        # /browse-decks/:id
```

### Route conventions

- **Marketing group** `(marketing)` — no URL segment; used for organization only
- **Dynamic `[id]`** — deck UUID for builder; prebuilt slug/id for browse
- **Deck builder** — full-screen layout (no footer); set in `SiteLayout` via pathname check

### Page → component mapping

| Route | Page file | Main component |
|-------|-----------|----------------|
| `/` | `(marketing)/page.tsx` | Inline marketing sections |
| `/cards` | `(marketing)/cards/page.tsx` | `CardBrowser` |
| `/deck-builder` | `deck-builder/page.tsx` | `DeckBuilder` |
| `/deck-builder/[id]` | `deck-builder/[id]/page.tsx` | `DeckBuilder` |
| `/decks` | `decks/page.tsx` | `MyDecksView` |
| `/browse-decks` | `browse-decks/page.tsx` | `BrowseDecksView` |
| `/browse-decks/[id]` | `browse-decks/[id]/page.tsx` | `BrowseDeckDetail` |
| `/login` | `(marketing)/login/page.tsx` | `LoginForm` |
| `/register` | `(marketing)/register/page.tsx` | `RegisterForm` |

Pages are thin — metadata + `Container` wrapper + one view component.

---

## `src/components/` — UI

Grouped by feature. Client components use `"use client"` where they need hooks/events.

```
components/
├── layout/          # Site chrome
│   ├── site-layout.tsx    # Navbar + main + conditional footer
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── container.tsx      # max-w-7xl wrapper
│   ├── page-header.tsx
│   └── section-header.tsx
├── navigation/      # Nav items, auth actions, mobile menu
├── auth/            # LoginForm, RegisterForm
├── cards-browser/   # Card search UI (shared by /cards + builder)
│   ├── card-browser.tsx       # /cards page orchestrator
│   ├── card-filters-panel.tsx # Filter UI (reads card-filters.ts)
│   ├── card-grid.tsx
│   ├── card-item.tsx
│   ├── card-detail-panel.tsx
│   ├── search-bar.tsx
│   └── range-slider-field.tsx # react-range wrapper
├── deck-builder/    # Builder-specific UI
│   ├── deck-builder.tsx       # Top-level 3-panel layout
│   ├── card-search-panel.tsx  # Right panel (reuses cards-browser)
│   ├── deck-zone.tsx          # Main/Extra/Side zones
│   ├── deck-panel-header.tsx  # Save, import, export, clear
│   ├── deck-io-dialog.tsx     # Import/export modal
│   ├── drag-drop-provider.tsx # dnd-kit context
│   └── card-detail-viewer.tsx
├── my-decks/        # Saved deck list
├── browse-decks/    # Prebuilt deck list + detail
├── cards/           # Marketing cards (FeatureCard, StatCard)
└── ui/              # Generic primitives (buttons, skeleton, empty-state)
```

### Component patterns

- **Orchestrators** (`card-browser`, `deck-builder`, `my-decks-view`) — own local state, call hooks
- **Presentational** (`card-item`, `deck-zone-card`) — props in, JSX out
- **Shared filter panel** — `CardFiltersPanel` used on `/cards` and deck builder search
- **Styling** — Tailwind v4 with CSS variables: `bg-(--color-surface-1)`, `rounded-md`
- **Class merging** — `cn()` from `@/lib/utils`

---

## `src/hooks/` — Client Hooks

| Hook | File | Role |
|------|------|------|
| `useDeck` | `use-deck.ts` | In-memory deck state: add/remove/move, validation stats |
| `useSavedDecks` | `use-saved-decks.ts` | CRUD wrapper over `deck-storage.ts` |
| `useBrowseCards` | `use-browse-cards.ts` | Card list strategy: API vs full pool vs browse slice |
| `useCards` | `use-cards.ts` | TanStack Query wrapper for `fetchCards` |
| `useArchetypes` | `use-archetypes.ts` | Archetype datalist from full card pool |
| `useDebounce` | `use-debounce.ts` | Search input debounce (350ms) |

### `useBrowseCards` data strategy

```
filtersNeedApi(search, filters)?
  YES → useCards(filtersToApiParams(...))     # YGOProDeck filtered query
  NO  → filtersUseMonsterPool?
          YES → allCardsQuery (full pool)     # client type filter only
          NO  → allCards.slice(0, 100)        # default browse

→ finalizeCards(raw, filters)                 # client type + sort
```

---

## `src/providers/` — Context

| Provider | File | Role |
|----------|------|------|
| `QueryProvider` | `query-provider.tsx` | TanStack Query client; prefetches initial cards + full pool |
| `AuthProvider` | `auth-context.tsx` | Dummy auth via `localStorage`; `useSyncExternalStore` |

Auth storage key: `deck-forge:user`  
Demo accounts: `src/lib/dummy-users.ts`

---

## `src/types/` — Type Definitions

| File | Exports |
|------|---------|
| `deck.ts` | `Deck`, `SavedDeck`, `DeckZone`, `DeckCardEntry`, `DECK_LIMITS` |
| `yugioh.ts` | `YugiohCard`, `CardSearchParams`, `CARD_ATTRIBUTES` |
| `deck-io.ts` | `DeckFormatId`, `ParsedDeckList`, `ImportResult` |
| `prebuilt-deck.ts` | `PrebuiltDeck` extends `SavedDeck` |
| `auth.ts` | `User`, `DummyAccount` |
| `index.ts` | Shared UI prop types (`NavItem`, etc.) |

**Canonical deck model:** zones hold `{ card: YugiohCard, quantity }[]` — full card objects, not IDs only.

---

## Data Flow Diagrams

### Card browse / search

```
User input (search + filters)
        ↓
CardFiltersPanel → CardFilters state
        ↓
useBrowseCards
        ↓
card-filters.ts → filtersToApiParams / filtersNeedApi
        ↓
ygoprodeck.ts → fetchCards / fetchAllCards
        ↓
finalizeCards → CardGrid
```

### Deck builder save

```
DeckBuilder state (useDeck)
        ↓
handleSave → useSavedDecks.save(deck)
        ↓
deck-storage.ts → localStorage["deck-forge:decks"]
        ↓
router.replace(/deck-builder/{id})
```

### Deck import

```
DeckIoDialog (paste / file)
        ↓
deck-io/parse.ts → ParsedDeckList
        ↓
deck-io/resolve.ts → YugiohCard lookup (API + pool)
        ↓
replaceDeck → useDeck state
```

---

## Conventions

### Imports

```ts
import { cn } from "@/lib/utils";
import type { Deck } from "@/types/deck";
import { fetchCards } from "@/lib/ygoprodeck";
```

### Client vs server

- **Server components:** page files with metadata only
- **Client components:** anything with `useState`, hooks, browser APIs, dnd-kit
- **Lib files:** no `"use client"` — safe for tests and SSR imports

### Adding a new page

1. Create `src/app/<route>/page.tsx` with metadata
2. Wrap content in `<Container>` (unless full-bleed like builder)
3. Extract view logic to `src/components/<feature>/`
4. Add nav link in `navbar.tsx` + `footer.tsx` if public

### Adding a new filter

1. Extend `CardFilters` in `card-filters.ts`
2. Update `filtersNeedApi`, `filtersToApiParams`
3. Add UI in `card-filters-panel.tsx`
4. If API-supported, extend `CardSearchParams` + `ygoprodeck.ts` URL builder

### Testing

- Unit tests live next to lib code: `src/lib/deck-io/__tests__/`
- Run: `pnpm test` or `pnpm test:watch`
- Mock `@/lib/ygoprodeck` for import resolution tests

---

## Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Legacy `/app/*` redirects, YGOProDeck image domain |
| `vitest.config.ts` | `@/` alias, happy-dom environment |
| `tsconfig.json` | Path mapping `@/*` → `./src/*` |
| `src/app/globals.css` | CSS custom properties + Tailwind `@theme` radius tokens |

---

## Related

- [LIBRARIES.md](./LIBRARIES.md) — detailed `src/lib` module reference
- [PROJECT.md](../PROJECT.md) — user-facing feature list
