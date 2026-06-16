/**
 * Sync cards + archetypes from YGOProDeck API into Postgres.
 *
 * Usage (do not run casually — full card dump is large):
 *   pnpm db:sync
 *   pnpm db:sync -- --dry-run
 *   pnpm db:sync -- --archetypes-only
 */
import "./bootstrap-env";
import { inArray, isNotNull, sql } from "drizzle-orm";
import { closeDb, db } from "@/db";
import {
  banlistEntries,
  cardImages,
  cardPrices,
  cardSets,
  cards,
  type NewBanlistEntryRecord,
  type NewCardRecord,
} from "@/db/schema/cards";
import { upsertArchetype } from "@/features/archetypes/archetypes.repository";

const API_BASE = "https://db.ygoprodeck.com/api/v7";
const BATCH_SIZE = 200;

const BANLIST_KEYS = {
  ban_tcg: "tcg",
  ban_ocg: "ocg",
  ban_goat: "goat",
  ban_masterduel: "master_duel",
  ban_speed: "speed_duel",
  ban_duel_links: "duel_links",
} as const;

type BanlistFormat = (typeof BANLIST_KEYS)[keyof typeof BANLIST_KEYS];

interface YgoCardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

interface YgoCardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code?: string;
  set_price?: string;
}

interface YgoCardPrices {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
  coolstuffinc_price?: string;
}

interface YgoBanlistInfo {
  ban_tcg?: string;
  ban_ocg?: string;
  ban_goat?: string;
  ban_masterduel?: string;
  ban_speed?: string;
  ban_duel_links?: string;
}

interface YgoCard {
  id: number;
  name: string;
  type: string;
  human_readable_cardtype?: string;
  frameType: string;
  desc: string;
  race?: string;
  attribute?: string;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  rank?: number | null;
  linkval?: number | null;
  scale?: number | null;
  archetype?: string;
  typeline?: string[] | null;
  linkmarkers?: string[] | null;
  ygoprodeck_url?: string;
  card_images?: YgoCardImage[];
  card_sets?: YgoCardSet[];
  card_prices?: YgoCardPrices[];
  banlist_info?: YgoBanlistInfo;
}

function parseStat(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parsePrice(value: string | undefined): string | null {
  if (!value || value === "0.00") return null;
  return value;
}

function toCardRecord(card: YgoCard, syncedAt: Date): NewCardRecord {
  return {
    id: card.id,
    name: card.name,
    type: card.type,
    humanReadableCardType: card.human_readable_cardtype ?? null,
    frameType: card.frameType,
    desc: card.desc,
    race: card.race ?? null,
    attribute: card.attribute ?? null,
    atk: parseStat(card.atk),
    def: parseStat(card.def),
    level: parseStat(card.level),
    rank: parseStat(card.rank),
    linkval: parseStat(card.linkval),
    scale: parseStat(card.scale),
    archetype: card.archetype ?? null,
    typeline: card.typeline ?? null,
    linkMarkers: card.linkmarkers ?? null,
    ygoprodeckUrl: card.ygoprodeck_url ?? null,
    syncedAt,
  };
}

function toBanlistRows(cardId: number, info: YgoBanlistInfo | undefined, syncedAt: Date) {
  if (!info) return [] as NewBanlistEntryRecord[];
  const rows: NewBanlistEntryRecord[] = [];
  for (const [apiKey, format] of Object.entries(BANLIST_KEYS) as [keyof YgoBanlistInfo, BanlistFormat][]) {
    const status = info[apiKey];
    if (status) rows.push({ cardId, format, status, syncedAt });
  }
  return rows;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed: HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllCards(): Promise<YgoCard[]> {
  const json = await fetchJson<{ data: YgoCard[] }>(`${API_BASE}/cardinfo.php`);
  return json.data ?? [];
}

async function fetchArchetypeNames(): Promise<string[]> {
  const json = await fetchJson<{ data: string[] }>(`${API_BASE}/archetypes.php`);
  return json.data ?? [];
}

async function syncCardBatch(batch: YgoCard[], syncedAt: Date) {
  const ids = batch.map((c) => c.id);
  const cardRows = batch.map((c) => toCardRecord(c, syncedAt));

  const imageRows = batch.flatMap((card) =>
    (card.card_images ?? []).map((img) => ({
      cardId: card.id,
      imageId: img.id,
      imageUrl: img.image_url,
      imageUrlSmall: img.image_url_small,
      imageUrlCropped: img.image_url_cropped,
    }))
  );

  const setRows = batch.flatMap((card) =>
    (card.card_sets ?? []).map((set) => ({
      cardId: card.id,
      setName: set.set_name,
      setCode: set.set_code,
      setRarity: set.set_rarity,
      setRarityCode: set.set_rarity_code ?? null,
      setPrice: parsePrice(set.set_price),
    }))
  );

  const priceRows = batch
    .map((card) => {
      const prices = card.card_prices?.[0];
      if (!prices) return null;
      return {
        cardId: card.id,
        cardmarketPrice: parsePrice(prices.cardmarket_price),
        tcgplayerPrice: parsePrice(prices.tcgplayer_price),
        ebayPrice: parsePrice(prices.ebay_price),
        amazonPrice: parsePrice(prices.amazon_price),
        coolstuffincPrice: parsePrice(prices.coolstuffinc_price),
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const banlistRows = batch.flatMap((card) =>
    toBanlistRows(card.id, card.banlist_info, syncedAt)
  );

  await db.transaction(async (tx) => {
    await tx
      .insert(cards)
      .values(cardRows)
      .onConflictDoUpdate({
        target: cards.id,
        set: {
          name: sql`excluded.name`,
          type: sql`excluded.type`,
          humanReadableCardType: sql`excluded.human_readable_card_type`,
          frameType: sql`excluded.frame_type`,
          desc: sql`excluded.desc`,
          race: sql`excluded.race`,
          attribute: sql`excluded.attribute`,
          atk: sql`excluded.atk`,
          def: sql`excluded.def`,
          level: sql`excluded.level`,
          rank: sql`excluded.rank`,
          linkval: sql`excluded.linkval`,
          scale: sql`excluded.scale`,
          archetype: sql`excluded.archetype`,
          typeline: sql`excluded.typeline`,
          linkMarkers: sql`excluded.link_markers`,
          ygoprodeckUrl: sql`excluded.ygoprodeck_url`,
          syncedAt: sql`excluded.synced_at`,
        },
      });

    await tx.delete(cardImages).where(inArray(cardImages.cardId, ids));
    if (imageRows.length > 0) await tx.insert(cardImages).values(imageRows);

    await tx.delete(cardSets).where(inArray(cardSets.cardId, ids));
    if (setRows.length > 0) await tx.insert(cardSets).values(setRows);

    if (priceRows.length > 0) {
      await tx
        .insert(cardPrices)
        .values(priceRows)
        .onConflictDoUpdate({
          target: cardPrices.cardId,
          set: {
            cardmarketPrice: sql`excluded.cardmarket_price`,
            tcgplayerPrice: sql`excluded.tcgplayer_price`,
            ebayPrice: sql`excluded.ebay_price`,
            amazonPrice: sql`excluded.amazon_price`,
            coolstuffincPrice: sql`excluded.coolstuffinc_price`,
          },
        });
    }

    await tx.delete(banlistEntries).where(inArray(banlistEntries.cardId, ids));
    if (banlistRows.length > 0) await tx.insert(banlistEntries).values(banlistRows);
  });
}

async function syncArchetypes(cardArchetypes: Iterable<string>, apiArchetypes: string[]) {
  const names = new Set<string>();
  for (const name of apiArchetypes) {
    if (name.trim()) names.add(name.trim());
  }
  for (const name of cardArchetypes) {
    if (name.trim()) names.add(name.trim());
  }

  let count = 0;
  for (const name of [...names].sort((a, b) => a.localeCompare(b))) {
    await upsertArchetype(name);
    count++;
  }
  return count;
}

async function cardArchetypeNamesFromDb(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ name: cards.archetype })
    .from(cards)
    .where(isNotNull(cards.archetype));
  return rows.map((row) => row.name).filter((name): name is string => Boolean(name));
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const archetypesOnly = process.argv.includes("--archetypes-only");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const startedAt = Date.now();

  if (archetypesOnly) {
    console.log("Syncing archetypes only…");
    const [apiArchetypes, cardArchetypes] = await Promise.all([
      fetchArchetypeNames(),
      cardArchetypeNamesFromDb(),
    ]);
    console.log(
      `Found ${apiArchetypes.length} API archetypes, ${cardArchetypes.length} from cards table`
    );
    if (dryRun) {
      console.log("Dry run — no database writes.");
      return;
    }
    const archetypeCount = await syncArchetypes(cardArchetypes, apiArchetypes);
    console.log(`Synced ${archetypeCount} archetypes in ${Date.now() - startedAt}ms`);
    return;
  }

  console.log("Fetching YGOProDeck card dump…");
  const [apiCards, apiArchetypes] = await Promise.all([fetchAllCards(), fetchArchetypeNames()]);
  console.log(`Fetched ${apiCards.length} cards, ${apiArchetypes.length} archetype names`);

  if (dryRun) {
    console.log("Dry run — no database writes.");
    return;
  }

  const syncedAt = new Date();

  for (let i = 0; i < apiCards.length; i += BATCH_SIZE) {
    const batch = apiCards.slice(i, i + BATCH_SIZE);
    await syncCardBatch(batch, syncedAt);
    console.log(`Cards ${Math.min(i + BATCH_SIZE, apiCards.length)} / ${apiCards.length}`);
  }

  const archetypeNames = apiCards
    .map((c) => c.archetype)
    .filter((name): name is string => Boolean(name));
  const archetypeCount = await syncArchetypes(archetypeNames, apiArchetypes);

  console.log(`Synced ${apiCards.length} cards and ${archetypeCount} archetypes in ${Date.now() - startedAt}ms`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
