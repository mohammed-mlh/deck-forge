# Deployment

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database
- [Clerk](https://clerk.com) application
- (Optional) [DeepSeek](https://platform.deepseek.com) API key for AI features

## Environment variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public site URL, e.g. `https://deckforge.example.com` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `DEEPSEEK_API_KEY` | No | Enables real AI analysis; without it, mock responses are used |
| `AI_RATE_LIMIT_WINDOW_MS` | No | AI rate limit window (default: 1 hour) |
| `AI_RATE_LIMIT_MAX` | No | Max AI requests per user per window (default: 20) |

## Local development

```bash
pnpm install
cp .env.example .env
# Edit .env with your local DATABASE_URL and Clerk keys

pnpm db:migrate
pnpm db:sync          # Sync cards + archetypes from YGOProDeck (large download)
pnpm dev
```

Optional data scripts:

```bash
pnpm curate-decks     # Seed public decks from YGOProDeck
pnpm fix-public-decks # Fix unknown card IDs in public decks
```

## Production deploy

### 1. Build

```bash
pnpm install
pnpm db:migrate
pnpm build
```

The build step queries the database for the sitemap and archetypes index. Ensure `DATABASE_URL` is set in the build environment.

### 2. Seed production data

Run once after first deploy (or when refreshing card data):

```bash
pnpm db:sync
pnpm curate-decks
pnpm fix-public-decks
```

### 3. Start

```bash
pnpm start
```

### Vercel / similar

1. Set all environment variables in the hosting dashboard.
2. Add a **build command**: `pnpm build`
3. Run migrations against production Postgres before or during first deploy:

   ```bash
   DATABASE_URL="..." pnpm db:migrate
   ```

4. Seed cards via a one-off job or local script pointed at production `DATABASE_URL`.

### Clerk

- Set sign-in/sign-up redirect URLs to your production domain.
- Allowed origins must include `NEXT_PUBLIC_SITE_URL`.

## Health checks

After deploy, verify:

- `/` — homepage loads
- `/app/cards` — card browser returns results (requires `db:sync`)
- `/decks` — public deck library (requires `curate-decks`)
- `/archetypes` — archetype grid (requires `db:sync`)
- Sign in → `/app/my-decks` — saved decks work
- `/sitemap.xml` and `/robots.txt` — correct canonical URLs under `/app/*`

## Notes

- Legacy paths (`/cards`, `/decks`, `/deck-builder`) redirect to `/app/*` via `next.config.ts`.
- `/guides` routes are currently drafted off; do not link to them until restored.
- AI features require `DEEPSEEK_API_KEY` in production.
