# DeckForge — Project Description

> Developer docs: [docs/README.md](./docs/README.md) · [CODEBASE.md](./docs/CODEBASE.md) · [LIBRARIES.md](./docs/LIBRARIES.md)

DeckForge is a modern Yu-Gi-Oh deck building web app. Users can browse the card database, build decks with drag-and-drop, save decks to the cloud, browse public community decks, import/export in many formats, and run AI deck analysis.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · dnd-kit · Clerk · Drizzle/Postgres · YGOProDeck API

---

## Design & Layout

- **Theme:** Dark-first, minimal SaaS aesthetic (Forge Violet `#7C3AED` primary)
- **Global layout:** `SiteLayout` — sticky navbar, main content, footer
- **Deck Builder exception:** Full viewport height, no footer, no page padding
- **Container:** `max-w-7xl` (`Container` component) on standard pages

### Navigation

| Link | Route |
|------|-------|
| Cards | `/cards` |
| Deck Builder | `/deck-builder` |
| Decks | `/decks` |
| My Decks | `/my-decks` |
| Sign in / User menu | Clerk (`SignInButton`, `UserButton`) |

---

## Pages

### `/` — Home (Marketing)

Landing page with hero, feature highlights, and CTAs to Cards and Deck Builder.

---

### `/cards` — Card Database

Browse and search the YGOProDeck card pool.

**Features:**
- Text search (debounced, 350ms)
- Full filter sidebar (desktop) / toggle panel (mobile)
- Responsive card grid (up to 6 columns)
- Card detail slide-over panel on click
- Initial browse loads 100 cards; filters/search trigger API queries

---

### `/deck-builder` — Deck Builder (new deck)

### `/deck-builder/[id]` — Deck Builder (saved deck)

Three-panel builder layout:

| Panel | Purpose |
|-------|---------|
| Left | Selected card detail viewer |
| Center | Main / Extra / Side deck zones + header actions |
| Right | Card search + filters + 4-column result grid |

**Features:**
- Drag cards from search into zones (`@dnd-kit`); drag between zone slots
- Click to preview, double-click to add
- Deck name editing
- Zone counts with min/max indicators (Main 40–60, Extra/Side 0–15)
- Save to Postgres → redirects to `/deck-builder/{id}` (requires Clerk sign-in)
- Clear deck
- **Import** — multi-format dialog (file upload or paste)
- **Export** — format picker, copy, download
- Import error/warning toast for unresolved cards
- Validation issues banner; add/move rejection messages
- **AI Analyze** — deck analysis panel (rate-limited, auth required)
- **Deck Doctor** — AI improvement suggestions (rate-limited, auth required)
- Deck rules: max 3 copies, extra-deck cards auto-routed to Extra

---

### `/my-decks` — My Decks

Saved decks for the signed-in user (Postgres via `/api/decks`).

**Features:**
- Deck list cards with preview art, zone counts, delete
- Stats: total saved decks, total cards
- Empty state → link to Deck Builder
- “New Deck” CTA in header

---

### `/decks` — Public Decks

Community decks with `visibility = public` from the database.

**Features:**
- Deck cards with zone counts, featured monster art
- Links to `/decks/[id]`

### `/decks/[id]` — Public Deck Detail

**Features:**
- Deck metadata and zone breakdowns (Main / Extra / Side)
- **Copy deck** → fork to your account (`POST /api/decks/fork`, requires sign-in)

All new decks save as **private**; visibility is not user-editable in the UI.

---

## Card Filters

Shared `CardFiltersPanel` on `/cards` and Deck Builder search. Logic in `src/lib/card-filters.ts`. Filters are **API-first** — when active, queries hit YGOProDeck; client only applies type filter + sort.

### Global

| Filter | Options |
|--------|---------|
| Card type | All, Monster, Spell, Trap |
| Attribute | DARK, LIGHT, EARTH, WATER, FIRE, WIND, DIVINE |
| Archetype | Free text + datalist (from `archetypes.php`) |
| Sort | Name A–Z, ATK ↓, DEF ↓, Level ↓ |
| Reset | Clears all filters |

### Monster filters *(when type = All or Monster)*

| Filter | Type |
|--------|------|
| Frame | Normal, Effect, Ritual, Fusion, Synchro, XYZ, Link, Pendulum (checkboxes) |
| Type (race) | Free text + datalist (e.g. Dragon, Spellcaster) |
| Level / Rank | Dual-thumb range slider (0–13) |
| ATK | Range slider (0–5000, step 100) |
| DEF | Range slider (0–5000, step 100) |
| Link rating | Range slider (1–8) — shown when Link frame selected or no frame filter |
| Link markers | Top, Bottom, Left, Right, corners (checkboxes) |
| Pendulum scale | Range slider (0–13) — shown when Pendulum frame selected or no frame filter |
| Has effect only | Checkbox |

### Spell filters *(when type = Spell)*

| Filter | Options |
|--------|---------|
| Spell type | Normal, Quick-Play, Continuous, Equip, Field, Ritual |

### Trap filters *(when type = Trap)*

| Filter | Options |
|--------|---------|
| Trap type | Normal, Continuous, Counter |

### API mapping

Filters sent to YGOProDeck as: `fname`, `attribute`, `archetype`, `race`, `frameType`, `linkmarker`, `has_effect`, and bounded `level` / `atk` / `def` / `link` / `scale` params (`gte` / `lte`).

---

## Deck Import / Export

Implemented in `src/lib/deck-io/`. UI: Import/Export buttons in Deck Builder header → modal dialog.

### Supported formats (10)

| Format | Extension | Import | Export | Notes |
|--------|-----------|--------|--------|-------|
| YGOProDeck | `.txt` | ✓ | ✓ | `#main`, `#extra`, `!side` + card names |
| YDK | `.ydk` | ✓ | ✓ | Zone sections + card IDs |
| YDKE URL | `.ydke` | ✓ | ✓ | `ydke://` base64 (DuelingBook, EDOPro) |
| JSON portable | `.json` | ✓ | ✓ | `{ id, quantity }` per zone |
| JSON full | `.json` | ✓ | ✓ | Complete DeckForge deck object |
| CSV | `.csv` | ✓ | ✓ | `zone,id,name,quantity` |
| TSV | `.tsv` | ✓ | ✓ | Tab-separated |
| XML | `.xml` | ✓ | ✓ | Simple `<deck>` structure |
| Plain IDs | `.ids` | ✓ | ✓ | Comma/newline IDs (main) |
| Plain names | `.names` | ✓ | ✓ | One name per line (main) |

### Import flow

1. Auto-detect format from content/extension (manual override available)
2. Parse → resolve card IDs/names via YGOProDeck API (`fetchCardsByIds`, `fetchCards({ name })`)
3. Replace current deck zones; show unresolved card errors
4. JSON full imports skip API lookup (uses embedded card data)

### Export flow

1. Pick format → live preview
2. Copy to clipboard or download file

### Tests

```bash
pnpm test src/lib/deck-io/__tests__/deck-io.test.ts
```

---

## Deck Rules & Validation

| Rule | Value |
|------|-------|
| Main deck | 40–60 cards |
| Extra deck | 0–15 cards |
| Side deck | 0–15 cards |
| Max copies | 3 per card (across all zones) |
| Extra deck monsters | Must go in Extra zone |
| Main/Side monsters | Cannot be Fusion/Synchro/XYZ/Link |

Validation via `validateDeck()` on client and server (with hydrated cards). Issues surfaced in builder UI.

---

## Data & Storage

| Data | Storage |
|------|---------|
| Saved decks | Postgres (`decks` table) via `/api/decks` |
| Deck analyses | Postgres (`deck_analyses` table) |
| Auth | Clerk |
| Card API cache | In-memory (5 min TTL) in `ygoprodeck-sdk` |

**Saved deck shape:**
```ts
{
  id: string
  name: string
  main: { card: YugiohCard, quantity: number }[]
  extra: ...
  side: ...
  visibility: "private" | "public"
  updatedAt: string
}
```

Editor `Deck` type omits `visibility` — all creates default to `private`.

---

## External API

**YGOProDeck v7** — `https://db.ygoprodeck.com/api/v7/`

| Endpoint | Use |
|----------|-----|
| `cardinfo.php` | Browse, search, filter, bulk ID lookup |
| `archetypes.php` | Archetype datalist |

Card images hosted at `images.ygoprodeck.com` (configured in `next.config.ts`).

---

## Redirects (Legacy Routes)

| From | To |
|------|----|
| `/browse-decks` | `/decks` |
| `/browse-decks/prebuilt-*` | `/decks` |
| `/app` | `/deck-builder` |
| `/app/builder` | `/deck-builder` |
| `/app/my-decks` | `/my-decks` |
| `/app/settings` | `/deck-builder` |
| `/app/ai` | `/deck-builder` |
| `/get-started`, `/login`, `/register`, `/sign-in`, `/sign-up` | `/` |

---

## Project Structure (Key Paths)

```
src/
├── app/
│   ├── (marketing)/       # Home, cards
│   ├── deck-builder/      # Builder pages
│   ├── my-decks/          # User's saved decks
│   ├── decks/             # Public decks + detail
│   └── api/decks/         # CRUD + fork
├── components/
│   ├── cards-browser/
│   ├── deck-builder/
│   ├── decks/
│   └── layout/
├── features/
│   ├── decks/             # Service, repository, mapper
│   └── deck-analyses/
├── db/                    # Drizzle schema
├── lib/
│   ├── card-filters.ts
│   ├── deck-io/
│   ├── deck-rules.ts
│   ├── ygoprodeck-sdk.ts
│   └── auth/
├── hooks/
└── types/
```

---

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm test         # Vitest (deck-io tests)
```

---

## Not Yet Implemented

- User-editable deck visibility
- Meta tracking, pricing (marketing placeholders)
- Banlist filtering
- Company pages linked in footer (`/about`, `/blog`, `/privacy`, `/terms`)
