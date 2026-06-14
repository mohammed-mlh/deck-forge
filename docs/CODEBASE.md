# Codebase Guide

Developer reference for DeckForge source layout, conventions, and how pieces connect.

**Path alias:** `@/` → `src/`

---

## Repository layout

```
deck-forge/
├── docs/                    # Documentation
├── drizzle/                 # SQL migrations
├── PROJECT.md               # Product overview
├── src/
│   ├── app/                 # Next.js App Router (pages + API routes)
│   ├── components/          # React UI
│   ├── features/            # Domain services (decks, deck-analyses)
│   ├── db/                  # Drizzle schema + client
│   ├── hooks/               # Client hooks
│   ├── lib/                 # Pure logic, API clients (see LIBRARIES.md)
│   ├── providers/           # React providers
│   └── types/               # Shared TypeScript types
├── vitest.config.ts
└── next.config.ts           # Redirects, image domains
```

---

## `src/app/` — Routes

```
app/
├── layout.tsx               # Root: fonts, QueryProvider, Clerk, SiteLayout
├── (marketing)/
│   ├── page.tsx             # /
│   └── cards/page.tsx       # /cards
├── deck-builder/
│   ├── page.tsx             # /deck-builder
│   └── [id]/page.tsx        # /deck-builder/:id
├── my-decks/                # /my-decks — signed-in user's decks
├── decks/
│   ├── page.tsx             # /decks — public decks (DB)
│   └── [id]/                # /decks/:id — public deck detail + copy
└── api/
    ├── decks/               # CRUD + fork
    └── deck/                # analyze, improve (AI)
```

Legacy URLs (`/browse-decks`, `/app/*`, `/login`) redirect via `next.config.ts`.

| Route | Main UI |
|-------|---------|
| `/cards` | `CardBrowser` |
| `/deck-builder` | `DeckBuilder` |
| `/deck-builder/[id]` | `DeckBuilder` (loads saved deck) |
| `/my-decks` | `MyDecksContent` |
| `/decks` | Public deck grid (server) |
| `/decks/[id]` | `PublicDeckDetail` |

Deck builder uses full viewport (no footer) via `SiteLayout` pathname check.

---

## `src/features/`

| Module | Role |
|--------|------|
| `decks/` | `decks.repository`, `decks.service`, `decks.mapper`, `decks.schema` — Postgres CRUD |
| `deck-analyses/` | Persist AI analysis results linked to deck ID |

API routes call services; services call repositories. Deck refs in DB are `{ id, quantity }[]` per zone.

---

## `src/components/`

```
components/
├── layout/              # navbar, footer, container, site-layout
├── cards-browser/       # Card search UI (/cards + builder right panel)
├── deck-builder/        # Builder layout, zones, I/O, AI panels, dnd-kit
├── decks/               # Public + saved deck cards
└── ui/                  # empty-state, skeleton, etc.
```

Auth UI: Clerk (`SignInButton`, `UserButton`) in navbar — not custom forms.

---

## `src/hooks/`

| Hook | Role |
|------|------|
| `useDeck` | In-memory editor state (add/remove/move, validation) |
| `useSavedDecks` | React Query → `/api/decks` (list, save, fork, delete) |
| `useBrowseCards` | Paginated or filtered card list via `fetchCards` |
| `useCards` | TanStack Query wrapper for `fetchCards` |
| `useArchetypes` | Archetypes API datalist |
| `useHydratedDeck` | Resolve stub cards to full API data |

---

## `src/providers/`

| Provider | Role |
|----------|------|
| `QueryProvider` | TanStack Query client (no global card prefetch) |
| Clerk | Auth (root layout) |

---

## Data flow

### Save deck

```
DeckBuilder (useDeck)
  → useSavedDecks.save(deck)
  → POST/PATCH /api/decks
  → decks.service (validate + Postgres)
```

All decks save as **private** by default; users cannot change visibility in the UI.

### Card browse

```
CardFilters → useBrowseCards
  → filtersNeedApi ? fetchCards(params) : paginated browse (100 cards)
  → finalizeCards (type + sort)
```

### Import

```
DeckIoDialog → parse → resolveParsedDeck
  → fetchCardsByIds / fetchCards by name
  → replaceDeck
```

### Public deck copy

```
/decks/[id] → getPublicDeckById
  → fork via POST /api/decks/fork (requires Clerk sign-in)
```

---

## `src/types/`

| File | Exports |
|------|---------|
| `deck.ts` | `Deck`, `SavedDeck`, `DeckZone`, `DECK_LIMITS` |
| `yugioh.ts` | `YugiohCard`, `CardSearchParams` |
| `deck-io.ts` | Import/export types |

Saved decks include `visibility` (`private` \| `public`) and `updatedAt` from DB.

---

## Testing

- `src/lib/deck-io/__tests__/deck-io.test.ts`
- Run: `pnpm test`

Mock `@/lib/ygoprodeck` in tests that resolve cards.

---

## Related

- [LIBRARIES.md](./LIBRARIES.md) — `src/lib` module reference
- [PROJECT.md](../PROJECT.md) — user-facing features
