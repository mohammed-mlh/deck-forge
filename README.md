# DeckForge

Modern Yu-Gi-Oh deck building platform — card browser, drag-and-drop builder, public deck library, and AI analysis.

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:sync
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm db:migrate` | Apply database migrations |
| `pnpm db:sync` | Sync cards + archetypes from YGOProDeck |
| `pnpm curate-decks` | Seed public decks |
| `pnpm fix-public-decks` | Fix unknown card IDs in public decks |

## Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md) for production setup, environment variables, and seeding steps.
