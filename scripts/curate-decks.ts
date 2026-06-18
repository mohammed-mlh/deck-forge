/**
 * Seed the public_decks table by scraping YGOPRODeck's deck listing API
 * (https://ygoprodeck.com/api/decks/getDecks.php).
 *
 * Pulls the most-viewed decks (sort=Views) across several categories (tournament
 * meta, budget, non-meta, anime, ...) with rich metadata (price, tournament,
 * format).
 *
 * When DEEPSEEK_API_KEY is set, each category's pool is sent to DeepSeek in
 * parallel batches of 25 decks. The model selects the best/most representative
 * decks (published) and rewrites their title, slug, and description; the rest
 * are kept as drafts. The table is fully refreshed on each run.
 *
 * Usage:
 *   pnpm curate-decks            # 100 decks per category
 *   pnpm curate-decks --per=300  # custom cap per category
 *   pnpm curate-decks --all      # every available deck (large)
 *   pnpm curate-decks --no-ai    # skip DeepSeek, publish all
 */
import "./bootstrap-env";
import { sql } from "drizzle-orm";
import { closeDb, db } from "@/db";
import { publicDecks } from "@/db/schema/public-decks";
import { slugify } from "@/lib/slug";

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

/** Decks per DeepSeek request. */
const BATCH_SIZE = 25;

const AI_ENABLED =
  !process.argv.slice(2).includes("--no-ai") && Boolean(process.env.DEEPSEEK_API_KEY?.trim());

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

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

type DeckStatus = "published" | "draft";

interface CuratedDeck {
  id: string;
  name: string;
  slug: string;
  status: DeckStatus;
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

  params.set("sort", "Views");
  const url = `${API}?&${params.toString()}${tournament ? "&tournament" : ""}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${source.label}`);
  const json = (await res.json()) as ApiDeck[] | { error: string };
  if (!Array.isArray(json)) return [];
  return json;
}

function toCurated(deck: ApiDeck, category: string, status: DeckStatus): CuratedDeck {
  return {
    id: deck.pretty_url,
    name: deck.deck_name,
    slug: deck.pretty_url,
    status,
    category,
    format: deck.format,
    author: "DeckForge",
    views: 10,
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

async function collectPool(source: CategorySource, seen: Set<string>): Promise<ApiDeck[]> {
  const pool: ApiDeck[] = [];
  let offset = 0;

  while (pool.length < PER_CATEGORY) {
    const page = await fetchPage(source, offset);
    if (page.length === 0) break;

    for (const deck of page) {
      if (pool.length >= PER_CATEGORY) break;
      if (seen.has(deck.pretty_url)) continue;
      if (toRefs(deck.main_deck).length === 0) continue;

      seen.add(deck.pretty_url);
      pool.push(deck);
    }

    offset += PAGE_SIZE;
    if (page.length < PAGE_SIZE) break;
    await new Promise((r) => setTimeout(r, 150));
  }

  return pool;
}

interface AiVerdict {
  index: number;
  keep: boolean;
  name?: string;
  slug?: string;
  description?: string;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function countRefs(raw: string): number {
  return toRefs(raw).reduce((total, ref) => total + ref.quantity, 0);
}

async function deepSeekChat(system: string, user: string): Promise<unknown> {
  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY?.trim()}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      temperature: 0,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned an empty response");
  return JSON.parse(content.replace(/^```(?:json)?|```$/g, "").trim());
}

function parseVerdicts(data: unknown): AiVerdict[] {
  const decks = (data as { decks?: unknown })?.decks;
  if (!Array.isArray(decks)) return [];
  return decks.flatMap((entry) => {
    const d = entry as Record<string, unknown>;
    if (typeof d.index !== "number") return [];
    return [
      {
        index: d.index,
        keep: Boolean(d.keep),
        name: typeof d.name === "string" ? d.name : undefined,
        slug: typeof d.slug === "string" ? d.slug : undefined,
        description: typeof d.description === "string" ? d.description : undefined,
      },
    ];
  });
}

async function curateBatch(
  category: string,
  items: Array<{ deck: ApiDeck; index: number }>
): Promise<AiVerdict[]> {
  const payload = items.map(({ deck, index }) => ({
    index,
    name: deck.deck_name,
    description: stripHtml(deck.deck_excerpt || deck.deck_description || "").slice(0, 300),
    format: deck.format,
    main: countRefs(deck.main_deck),
    extra: countRefs(deck.extra_deck),
    side: countRefs(deck.side_deck),
    views: deck.deck_views,
    tournament: deck.tournamentName ?? null,
  }));

  const system =
    "You are a Yu-Gi-Oh! deck curator and copywriter. Respond with valid JSON only.";
  const user = [
    `Category: ${category}`,
    "",
    "From the decks below, select only the genuinely best, complete, and",
    "representative decks for this category. Be selective — prefer legal,",
    "well-built decks over jokes, duplicates, or low-effort lists.",
    "",
    "For every deck index provided, return an entry. For kept decks set keep=true",
    "and provide: a clean human title in Title Case (no hyphens or em dashes), a",
    "url slug (lowercase words separated by single hyphens), and a concise 1-2",
    "sentence description of the deck's strategy. For rejected decks set keep=false.",
    "",
    'Return JSON: {"decks":[{"index":number,"keep":boolean,"name":string,"slug":string,"description":string}]}',
    "",
    `Decks:\n${JSON.stringify(payload)}`,
  ].join("\n");

  try {
    return parseVerdicts(await deepSeekChat(system, user));
  } catch (err) {
    console.warn(`  AI batch failed (${(err as Error).message}); keeping originals`);
    return items.map(({ index }) => ({ index, keep: true }));
  }
}

async function aiCurate(category: string, pool: ApiDeck[]): Promise<Map<number, AiVerdict>> {
  const indexed = pool.map((deck, index) => ({ deck, index }));
  const batches = chunk(indexed, BATCH_SIZE);
  const results = await Promise.all(batches.map((batch) => curateBatch(category, batch)));
  const map = new Map<number, AiVerdict>();
  for (const verdicts of results) {
    for (const verdict of verdicts) map.set(verdict.index, verdict);
  }
  return map;
}

function uniqueSlug(raw: string, used: Set<string>): string {
  const base = slugify(raw) || "deck";
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  used.add(slug);
  return slug;
}

function buildCurated(
  source: CategorySource,
  pool: ApiDeck[],
  verdicts: Map<number, AiVerdict>,
  usedSlugs: Set<string>
): CuratedDeck[] {
  return pool.map((deck, index) => {
    const verdict = verdicts.get(index);
    // No AI verdict (AI disabled) → publish as-is.
    const keep = verdict ? verdict.keep : true;
    const curated = toCurated(deck, source.label, keep ? "published" : "draft");

    if (keep && verdict?.name?.trim()) curated.name = verdict.name.trim();
    if (keep && verdict?.description?.trim()) {
      curated.description = verdict.description.trim().slice(0, 400);
    }
    const slugSeed = keep && verdict?.slug?.trim() ? verdict.slug : deck.pretty_url;
    curated.slug = uniqueSlug(slugSeed, usedSlugs);
    return curated;
  });
}

async function saveToDb(curated: CuratedDeck[]) {
  if (curated.length === 0) return;

  const rows = curated.map((deck) => ({
    name: deck.name,
    slug: deck.slug,
    status: deck.status,
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
        status: sql`excluded.status`,
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
  const usedSlugs = new Set<string>();

  console.log(
    `Target per category: ${PER_CATEGORY === Infinity ? "ALL" : PER_CATEGORY}` +
      ` | AI curation: ${AI_ENABLED ? "on" : "off"}\n`
  );

  for (const source of CATEGORIES) {
    const pool = await collectPool(source, seen);
    const verdicts = AI_ENABLED ? await aiCurate(source.label, pool) : new Map<number, AiVerdict>();
    const decks = buildCurated(source, pool, verdicts, usedSlugs);
    curated.push(...decks);
    const published = decks.filter((deck) => deck.status === "published").length;
    console.log(`${source.label}: pool ${pool.length}, published ${published}`);
  }

  console.log(`\nScraped ${curated.length} decks`);
  await db.delete(publicDecks);
  await saveToDb(curated);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
