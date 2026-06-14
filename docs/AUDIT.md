# DeckForge — Code Audit (problems to fix)

Generated from codebase scan. Build passes; ordered by priority.

---

## P0 — Product broken / security

### 1. Public decks cannot be published

- DB has `visibility` (`src/db/schema/decks.ts`), service supports it (`src/features/decks/decks.service.ts`).
- UI never sets it: `deckToCreateInput()` in `src/features/decks/decks.mapper.ts` omits `visibility`.
- All saves default to `private` → `/decks` (`getPublicDecks()`) stays empty unless rows are updated manually in SQL.

**Fix:** Visibility control in builder + pass through mapper/API.

### 2. Legacy redirects → 404

- `next.config.ts` redirects `/browse-decks/prebuilt-*` → `/decks/blue-eyes-chronicle`, etc.
- App uses `/decks/[id]` with **UUID** + `visibility = 'public'` (`src/features/decks/decks.repository.ts`).
- Human slug URLs always 404.

**Fix:** Remove redirects or redirect to `/decks`; seed/migrate public decks with real UUIDs.

### 3. AI routes unauthenticated / unbounded

- `src/app/api/deck/analyze/route.ts` and `src/app/api/deck/improve/route.ts` accept any POST.
- No Clerk auth, no rate limiting.
- With `DEEPSEEK_API_KEY` set → open cost exposure.

**Fix:** `requireUserId()`, rate limits, optional usage caps.

### 4. Copy deck fails silently when signed out

- `src/app/decks/[id]/content.tsx` → `fork()` → 401 from `/api/decks/fork`.
- `catch` only resets `copying`; no sign-in prompt.

**Fix:** Clerk modal / redirect; surface error message.

---

## P1 — Bugs / incomplete refactors

### 5. Archetypes load full card DB

- `src/hooks/use-archetypes.ts` uses `allCardsQuery` + `extractArchetypes()` (~12k cards).
- YGOPro provides `https://db.ygoprodeck.com/api/v7/archetypes.php` (dedicated endpoint).

**Fix:** `archetypesQuery` in `src/lib/ygoprodeck.ts`; drop `extractArchetypes` + `use-archetypes` hook (or thin wrapper only).

### 6. Global full-card prefetch on every page

- `src/providers/query-provider.tsx` prefetches browse params + entire `allCardsQuery` on app mount.

**Fix:** Remove prefetch; fetch on demand when user opens `/cards` or deck builder search.

### 7. Save POST vs PATCH race

- `src/hooks/use-saved-decks.ts`: `existing = listQuery.data?.some(...)`.
- Open `/deck-builder/[existing-id]` before list hydrates → POST duplicate UUID → PK conflict.

**Fix:** Use PATCH when `deckId` in URL, or fetch-by-id before save, or upsert on server.

### 8. Save errors not surfaced

- `src/components/deck-builder/deck-builder.tsx` `handleSave`: no try/catch.
- Failed save can still show "saved" and `router.replace`.

**Fix:** try/catch + error toast/state.

### 9. Clear desyncs URL

- `resetDeck()` in `src/hooks/use-deck.ts` generates new UUID.
- URL stays `/deck-builder/[old-id]`; refresh loads old DB deck.

**Fix:** `router.replace('/deck-builder')` on clear, or reset in place without new id until save.


=================================================
### 10. Marketing copy outdated

- `src/app/(marketing)/page.tsx`: "12 Starter Decks", "Save decks locally", "official starter decks".
- Product: DB + Clerk + community `/decks`.

**Fix:** Update copy and stats strip.

### 11. Duplicate / dead code

| Item | Location |
|------|----------|
| Unused public deck API | `src/app/api/decks/public/`, `src/app/api/decks/public/[id]/` (pages use server `getPublicDecks()` directly) |
| Dead component | `src/components/deck-builder/deck-analysis-view.tsx` (never imported) |
| Unused type | `ZoneCardRefs` in `src/types/deck-io.ts` |
| Stale `[slug]` routes | Check `src/app/decks/[slug]/` — remove if empty |


### 12. `deck-analyses` feature unwired

- DB: `src/db/schema/deck-analyses.ts`
- Feature: `src/features/deck-analyses/*`
- No API route persists analyses; UI calls `/api/deck/analyze` and discards result.

**Fix:** Wire service to analyze route, or remove feature until needed.

---
=================================================

## P2 — Architecture / UX gaps

### 13. `allCardsQuery` in hot paths

- `src/hooks/use-browse-cards.ts` — monster filter without API filters loads full DB client-side.
- `src/components/cards-browser/card-filters-panel.tsx` — monster race datalist from full DB.
- `src/lib/deck-io/resolve.ts` — `fetchAllCards()` on every import for name resolution.

**Fix:** API filters for races; import resolve via `fetchCardsByIds` when refs have ids; lazy-load full catalog only when needed.

### 14. Server validation weaker than builder

- `validateDeckRefs()` in `src/lib/deck-rules.ts`: zone max + copy limits only.
- Extra monsters in main can be saved via API/import (builder blocks via `canAddCardToZone`).

**Fix:** Extend server validation or hydrate + run `validateDeck` before persist.

### 15. Builder UX gaps

- `useDeck().issues` never shown in UI.
- `addCard` silently no-ops when rules reject.
- `moveCard` exported but not wired in UI.

### 16. Deck analysis stale after edits

- `src/components/deck-builder/deck-analysis-panel.tsx` refetch deps: `deck.id`, empty state — not card changes.


### 17. Partial hydration failures hidden

- `fetchCardsByIds` in `src/lib/ygoprodeck.ts`: `if (!res.ok) continue` — incomplete deck, no error.

### 18. `unlisted` visibility unused

- In enum/DB; no route or UI.

=================================================


---

## P3 — Cleanup / docs / tests

### ~~20. Documentation stale~~ ✓

- Updated `PROJECT.md`, `docs/CODEBASE.md`, `docs/LIBRARIES.md` for Clerk, Postgres, current routes, `ygoprodeck-sdk`, removed prebuilt/localStorage references.

### ~~21. Test coverage~~ (partial)

Added unit tests:
- `src/lib/__tests__/deck-rules.test.ts`
- `src/features/decks/__tests__/decks.mapper.test.ts`
- `src/features/decks/__tests__/decks.service.test.ts`
- `src/lib/ai/__tests__/sanitize-deck-doctor.test.ts`
- `src/lib/auth/__tests__/rate-limit.test.ts`

Still missing: API route integration tests, `requireUserId`, hooks.

### ~~22. Analytics stub~~ ✓

- `analytics_events` table + `features/analytics/` service/repository.
- `POST /api/analytics/events` persists events (Clerk userId when signed in).
- `AnalyticsProvider` wires `setAnalyticsProvider` → API.

### 23. SEO inconsistency

- `src/app/sitemap.ts` includes `/my-decks`.
- `src/app/my-decks/page.tsx` sets `noIndex: true`.
- `src/app/robots.ts` disallows `/my-decks`.

### 24. `src/types/index.ts` misnamed

- Only `NavItem` / `BreadcrumbItem` — not a types barrel.

---

## Working as intended

- `src/proxy.ts` runs as middleware (Next 16 — build shows `ƒ Proxy`).
- Clerk + Postgres deck CRUD for signed-in users (`/api/decks/*`, `use-saved-decks`).
- Deck builder edit → save → hydrate flow is structurally sound.
- Card browse + YGOPro filter pipeline works on API filter path.

---

## Recommended fix order

1. Visibility toggle + mapper
2. Remove/fix prebuilt redirects
3. Auth + rate limit AI routes
4. Archetypes via `archetypes.php`; remove full-DB prefetch
5. Save/copy error handling + POST/PATCH fix
6. Delete dead code (analysis-view, unused public API, unused types)
7. Update homepage + docs
8. Tests on `deck-rules` + `decks.service`


### 19. Public deck author display

- No Clerk username on browse cards after public-deck type removal.
