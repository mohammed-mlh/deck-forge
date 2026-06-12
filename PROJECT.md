# DeckForge — Project Description

> Developer docs: [docs/README.md](./docs/README.md) · [CODEBASE.md](./docs/CODEBASE.md) · [LIBRARIES.md](./docs/LIBRARIES.md)

DeckForge is a modern Yu-Gi-Oh deck building web app. Users can browse the full card database, build decks with drag-and-drop, save decks locally, explore community-style prebuilt lists, and import/export decks in many formats.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · dnd-kit · YGOProDeck API

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
| Browse Decks | `/browse-decks` |
| My Decks | `/decks` |
| Login / Register | `/login`, `/register` |

---

## Pages

### `/` — Home (Marketing)

Landing page with hero, feature highlights, and CTAs to Cards and Deck Builder.

> Note: Marketing copy references future features (AI Deck Doctor, Meta Tracker, Price Tracker) that are **not yet implemented**.

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
- Drag cards from search into zones (`@dnd-kit`)
- Click to preview, double-click to add
- Deck name editing
- Zone counts with min/max indicators (Main 40–60, Extra/Side 0–15)
- Save to `localStorage` → redirects to `/deck-builder/{id}`
- Clear deck
- **Import** — multi-format dialog (file upload or paste)
- **Export** — format picker, copy, download
- Import error/warning toast for unresolved cards
- Deck rules: max 3 copies, extra-deck cards auto-routed to Extra

---

### `/decks` — My Decks

Saved decks from browser `localStorage`.

**Features:**
- Deck list cards with preview art, zone counts, delete
- Stats: total saved decks, total cards
- Empty state → link to Deck Builder
- “New Deck” CTA in header

---

### `/browse-decks` — Browse Decks

Grid of 12 static prebuilt decks (read-only inspiration).

**Features:**
- Deck cards with archetype tag, author, zone counts, featured monster art
- Links to detail view

### `/browse-decks/[id]` — Prebuilt Deck Detail

**Features:**
- Deck metadata (name, archetype, author, description)
- Zone breakdowns (Main / Extra / Side) with card thumbnails
- Read-only — no copy-to-builder yet

**Prebuilt decks:**
1. Blue-Eyes Chronicle
2. Dark Magician Legacy
3. Sky Striker Mobilize
4. Eldlich Golden
5. Stardust Synchron *(5D's)*
6. Blackwing Assault *(5D's)*
7. Utopia Rising *(ZEXAL)*
8. Photon Galaxy *(ZEXAL)*
9. Odd-Eyes Pendulum *(ARC-V)*
10. Raid Raptors Strike *(ARC-V)*
11. Salamangreat Blaze *(VRAINS)*
12. Rokket Reload *(VRAINS)*

---

### `/login` · `/register` — Auth (Demo)

Client-side dummy auth with prepopulated accounts:

| Email | Password | Name |
|-------|----------|------|
| `duelist@deckforge.com` | `demo123` | Duelist |
| `pro@deckforge.com` | `demo123` | Pro Player |

- Session stored in `localStorage` (`deck-forge:user`)
- No route protection — auth is UI-only for MVP
- Register creates a local user entry (no backend)

---

## Card Filters

Shared `CardFiltersPanel` on `/cards` and Deck Builder search. Logic in `src/lib/card-filters.ts`. Filters are **API-first** — when active, queries hit YGOProDeck; client only applies type filter + sort.

### Global

| Filter | Options |
|--------|---------|
| Card type | All, Monster, Spell, Trap |
| Attribute | DARK, LIGHT, EARTH, WATER, FIRE, WIND, DIVINE |
| Archetype | Free text + datalist autocomplete |
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
2. Parse → resolve card IDs/names via YGOProDeck API + full card pool cache
3. Replace current deck zones; show unresolved card errors
4. JSON full imports skip API lookup (uses embedded card data)

### Export flow

1. Pick format → live preview
2. Copy to clipboard or download file

### Tests

```bash
pnpm test src/lib/deck-io/__tests__/deck-io.test.ts
```

12 tests covering parse, detect, export roundtrip, and resolve.

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

Validation issues surfaced via `validateDeck()` (warnings for under-40 main, errors for over-limit zones/copies).

---

## Data & Storage

| Data | Storage | Key |
|------|---------|-----|
| Saved decks | `localStorage` | `deck-forge:decks` |
| Auth user | `localStorage` | `deck-forge:user` |
| Card API cache | In-memory (5 min TTL) | — |
| Full card pool | TanStack Query cache (1 hr) | `["ygo","all-cards"]` |
| Prebuilt decks | Static TS module | `src/lib/prebuilt-decks.ts` |

**Deck shape:**
```ts
{
  id: string
  name: string
  main: { card: YugiohCard, quantity: number }[]
  extra: ...
  side: ...
  updatedAt?: string  // saved decks only
}
```

---

## External API

**YGOProDeck v7** — `https://db.ygoprodeck.com/api/v7/cardinfo.php`

- Card images hosted at `images.ygoprodeck.com` (configured in `next.config.ts`)
- Archetype list derived from full card pool
- Bulk ID lookup for deck import (`fetchCardsByIds`)

---

## Redirects (Legacy Routes)

| From | To |
|------|----|
| `/app` | `/deck-builder` |
| `/app/builder` | `/deck-builder` |
| `/app/my-decks` | `/decks` |
| `/app/settings` | `/deck-builder` |
| `/app/ai` | `/deck-builder` |
| `/get-started` | `/register` |

---

## Project Structure (Key Paths)

```
src/
├── app/
│   ├── (marketing)/     # Home, cards, login, register
│   ├── deck-builder/    # Builder pages
│   ├── decks/           # My decks
│   └── browse-decks/    # Prebuilt decks
├── components/
│   ├── cards-browser/   # Grid, filters, search, detail
│   ├── deck-builder/    # Builder UI, I/O dialog
│   ├── browse-decks/    # Prebuilt deck views
│   ├── my-decks/        # Saved deck list
│   └── layout/          # Navbar, footer, container
├── lib/
│   ├── card-filters.ts  # Filter state + API mapping
│   ├── deck-io/         # Import/export parsers
│   ├── deck-rules.ts    # Validation + zone logic
│   ├── deck-storage.ts  # localStorage CRUD
│   ├── prebuilt-decks.ts
│   └── ygoprodeck.ts    # API client
├── hooks/               # useDeck, useBrowseCards, useSavedDecks
└── types/               # deck, yugioh, deck-io, auth
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

- Real backend auth / user accounts
- Route protection for authenticated pages
- Copy prebuilt deck → builder
- AI suggestions, meta tracking, pricing (marketing placeholders)
- Banlist filtering
- Deck sharing / public URLs
- Company pages linked in footer (`/about`, `/blog`, `/privacy`, `/terms`)
