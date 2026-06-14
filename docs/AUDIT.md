# DeckForge — Code Audit

Last verified against codebase. Build passes.

---

## P0 — Product / security

### ~~1. Public decks cannot be published~~ — intentional

- All decks save as `private`; no visibility UI or API field (`decks.service.ts`, `decks.mapper.ts`).
- `/decks` stays empty until rows are set `public` in DB (admin/SQL).
- **Not a bug** — product decision. Re-open if user-facing publish is needed.

### ~~2. Legacy redirects → 404~~ ✓

- `next.config.ts`: `/browse-decks` and `/browse-decks/prebuilt-*` → `/decks` (no slug URLs).

### ~~3. AI routes unauthenticated / unbounded~~ ✓

- `/api/deck/analyze` and `/api/deck/improve`: `requireUserId()` + `assertAiRateLimit()`.

### ~~4. Copy deck fails silently when signed out~~ ✓

- `decks/[id]/content.tsx`: `openSignIn()` before fork; `copyError` state; 401 handling.

---

## P1 — Bugs / refactors

### ~~5. Archetypes load full card DB~~ ✓

- `use-archetypes.ts` → `archetypesQuery` / `archetypes.php` in `ygoprodeck-sdk.ts`.

### ~~6. Global full-card prefetch~~ ✓

- Removed from `query-provider.tsx`.

### ~~7. Save POST vs PATCH race~~ ✓

- `use-saved-decks.ts`: PATCH when URL id, list cache, deck cache, or `{ update: true }`.

### ~~8. Save errors not surfaced~~ ✓

- `deck-builder.tsx`: try/catch + `saveError` in header.

### ~~9. Clear desyncs URL~~ ✓

- Clear on saved deck → `router.replace("/deck-builder")` before reset.

### ~~10. Marketing copy outdated~~ ✓

- Homepage updated (cloud save, public decks, no prebuilt decks).

### ~~11. Duplicate / dead code~~ ✓

- Removed: `api/decks/public/*`, `[slug]` routes, `ZoneCardRefs`, unused public-deck types.
- `deck-analysis-view.tsx` — gone.

### ~~12. `deck-analyses` unwired~~ ✓

- Analyze route calls `createDeckAnalysis()` after success.

---

## P2 — Architecture / UX

### ~~13. `allCardsQuery` in hot paths~~ ✓

- Browse: paginated `fetchCards`; `MONSTER_RACES` static list.
- Import resolve: `fetchCardsByIds` + `fetchCards({ name })`.

### ~~14. Server validation weaker than builder~~ ✓

- `assertValidDeckInput`: hydrate refs + full `validateDeck` before persist.

### ~~15. Builder UX gaps~~ ✓

- Issues banner, add/move rejection toasts, `moveCard` wired in `drag-drop-provider`.

### ~~16. Deck analysis stale after edits~~ ✓

- `deckContentKey(deck)` as `key` on `DeckAnalysisPanel`.

### ~~17. Partial hydration failures hidden~~ ✓

- `fetchCardsByIds` throws on `!res.ok`.

### ~~18. `unlisted` visibility unused~~ ✓

- Removed from enum/schema/types.

### 19. Public deck author display — open

- `PublicDeckCard` shows name + counts only; no Clerk username on browse cards.
- `DeckRecord.userId` exists but is not surfaced in UI.

---

## P3 — Cleanup / docs / tests

### ~~20. Documentation stale~~ ✓

- `PROJECT.md`, `docs/CODEBASE.md`, `docs/LIBRARIES.md` updated.

### ~~21. Test coverage~~ (partial)

Added:
- `src/lib/__tests__/deck-rules.test.ts`
- `src/features/decks/__tests__/decks.mapper.test.ts`
- `src/features/decks/__tests__/decks.service.test.ts`
- `src/features/analytics/__tests__/analytics.service.test.ts`
- `src/lib/ai/__tests__/sanitize-deck-doctor.test.ts`
- `src/lib/auth/__tests__/rate-limit.test.ts`
- `src/lib/deck-io/__tests__/deck-io.test.ts`

Still missing: API route integration tests, `requireUserId`, hooks.

### ~~22. Analytics stub~~ ✓

- `analytics_events` table + `features/analytics/`.
- `track()` POSTs to `/api/analytics/events`.

### ~~23. SEO inconsistency~~ ✓

- `/my-decks` removed from sitemap (matches `noIndex` + robots disallow).

### ~~24. `src/types/index.ts` misnamed~~ ✓

- `NavItem` → `src/types/nav.ts`; `index.ts` removed.

---

## Working as intended

- Clerk + Postgres deck CRUD (`/api/decks/*`, `use-saved-decks`).
- Deck builder edit → save → hydrate flow.
- Card browse + YGOPro filter pipeline.
- All new decks private; public `/decks` requires DB `visibility = 'public'`.

---

## Remaining work

1. **#19** — Show author on public deck cards (Clerk username lookup or stored display name).
2. **#21** — API route + hook tests (optional).
3. **Publish flow** — Only if product wants user-facing public decks again.
