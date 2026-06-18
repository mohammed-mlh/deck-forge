/**
 * Seed the public_decks table by scraping YGOPRODeck's deck listing API
 * (https://ygoprodeck.com/api/decks/getDecks.php).
 *
 * Pulls full 40+ card decks across several categories (tournament meta, budget,
 * non-meta, anime, ...) with rich metadata (author, price, views, tournament,
 * format) and upserts them into public_decks (keyed by slug).
 *
 * Usage:
 *   pnpm curate-decks            # 100 decks per category
 *   pnpm curate-decks --per=300  # custom cap per category
 *   pnpm curate-decks --all      # every available deck (large)
 */
import "./bootstrap-env";
import { sql } from "drizzle-orm";
import { closeDb, db } from "@/db";
import { publicDecks } from "@/db/schema/public-decks";

const API = "https://ygoprodeck.com/api/decks/getDecks.php";

/** API returns at most 20 decks per request. */
const PAGE_SIZE = 20;

/**
 * How many decks to keep per category. Override with `--per=N`, or `--all`
 * to paginate every available deck (warning: categories have thousands).
 */
function maxPerCategory(): number {
  const args = process.argv.slice(2);
  if (args.includes("--all")) return Infinity;
  const perArg = args.find((a) => a.startsWith("--per="));
  if (perArg) {
    const value = Number(perArg.split("=")[1]);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return 100;
}

const PER_CATEGORY = maxPerCategory();

interface CategorySource {
  /** Friendly label used for grouping on the page. */
  label: string;
  /** Raw YGOPRODeck `format` value (omit for budget search). */
  format?: string;
  /** Max price filter (used by the budget category). */
  toprice?: number;
}

const CATEGORIES: CategorySource[] = [
  { label: "Tournament Meta (TCG)", format: "Tournament Meta Decks" },
  { label: "Tournament Meta (OCG)", format: "Tournament Meta Decks OCG" },
  { label: "Meta", format: "Meta Decks" },
  { label: "Non-Meta", format: "Non-Meta Decks" },
  { label: "Budget", toprice: 150 },
  { label: "Anime", format: "Anime Decks" },
];

interface ApiDeck {
  username: string;
  deck_name: string;
  deck_description: string;
  deck_excerpt: string;
  youtube_link: string | null;
  main_deck: string;
  extra_deck: string;
  side_deck: string;
  deck_views: number;
  deckNum: number;
  cover_card: string;
  deck_price: string;
  pretty_url: string;
  format: string;
  tournamentPlayerName?: string | null;
  tournamentName?: string | null;
}

interface DeckRef {
  id: number;
  quantity: number;
}

interface CuratedDeck {
  id: string;
  name: string;
  slug: string;
  category: string;
  format: string;
  author: string;
  views: number;
  price: number;
  coverCard: number;
  tournament: { name: string; player: string | null } | null;
  youtube: string | null;
  description: string;
  source: string;
  main: DeckRef[];
  extra: DeckRef[];
  side: DeckRef[];
}

function toRefs(raw: string): DeckRef[] {
  let ids: string[] = [];
  try {
    ids = JSON.parse(raw) as string[];
  } catch {
    return [];
  }
  const counts = new Map<number, number>();
  for (const value of ids) {
    const id = Number(value);
    if (!Number.isFinite(id)) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()].map(([id, quantity]) => ({ id, quantity }));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
}

async function fetchPage(source: CategorySource, offset: number): Promise<ApiDeck[]> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
  if (source.format) params.set("format", source.format);
  if (source.toprice) params.set("toprice", String(source.toprice));
  const tournament =
    source.format?.toLowerCase().startsWith("tournament meta decks") ?? false;

  const url = `${API}?&${params.toString()}${tournament ? "&tournament" : ""}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${source.label}`);
  const json = (await res.json()) as ApiDeck[] | { error: string };
  if (!Array.isArray(json)) return [];
  return json;
}

function toCurated(deck: ApiDeck, category: string): CuratedDeck {
  return {
    id: deck.pretty_url,
    name: deck.deck_name,
    slug: deck.pretty_url,
    category,
    format: deck.format,
    author: deck.username,
    views: deck.deck_views,
    price: Number(deck.deck_price) || 0,
    coverCard: Number(deck.cover_card) || 0,
    tournament: deck.tournamentName
      ? { name: deck.tournamentName, player: deck.tournamentPlayerName ?? null }
      : null,
    youtube: deck.youtube_link || null,
    description: stripHtml(deck.deck_excerpt || deck.deck_description || ""),
    source: `https://ygoprodeck.com/deck/${deck.pretty_url}`,
    main: toRefs(deck.main_deck),
    extra: toRefs(deck.extra_deck),
    side: toRefs(deck.side_deck),
  };
}

async function fetchCategory(
  source: CategorySource,
  curated: CuratedDeck[],
  seen: Set<string>
): Promise<number> {
  let kept = 0;
  let offset = 0;

  while (kept < PER_CATEGORY) {
    const page = await fetchPage(source, offset);
    if (page.length === 0) break;

    for (const deck of page) {
      if (kept >= PER_CATEGORY) break;
      if (seen.has(deck.pretty_url)) continue;
      if (toRefs(deck.main_deck).length === 0) continue;

      seen.add(deck.pretty_url);
      curated.push(toCurated(deck, source.label));
      kept += 1;
    }

    offset += PAGE_SIZE;
    if (page.length < PAGE_SIZE) break;
    await new Promise((r) => setTimeout(r, 150));
  }

  return kept;
}

async function saveToDb(curated: CuratedDeck[]) {
  if (curated.length === 0) return;

  const rows = curated.map((deck) => ({
    name: deck.name,
    slug: deck.slug,
    description: deck.description || null,
    main: deck.main,
    extra: deck.extra,
    side: deck.side,
    metadata: {
      category: deck.category,
      format: deck.format,
      author: deck.author,
      views: deck.views,
      price: deck.price,
      coverCard: deck.coverCard,
      tournament: deck.tournament,
      youtube: deck.youtube,
      source: deck.source,
    },
    updatedAt: new Date(),
  }));

  await db
    .insert(publicDecks)
    .values(rows)
    .onConflictDoUpdate({
      target: publicDecks.slug,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        main: sql`excluded.main`,
        extra: sql`excluded.extra`,
        side: sql`excluded.side`,
        metadata: sql`excluded.metadata`,
        updatedAt: sql`excluded.updated_at`,
      },
    });

  console.log(`Upserted ${rows.length} decks into public_decks`);
}

async function main() {
  const curated: CuratedDeck[] = [];
  const seen = new Set<string>();

  console.log(
    `Target per category: ${PER_CATEGORY === Infinity ? "ALL" : PER_CATEGORY}\n`
  );

  for (const source of CATEGORIES) {
    const kept = await fetchCategory(source, curated, seen);
    console.log(`${source.label}: kept ${kept} decks`);
  }

  console.log(`\nScraped ${curated.length} decks`);
  await saveToDb(curated);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
