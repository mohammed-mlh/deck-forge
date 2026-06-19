/**
 * Scan all public decks for unknown card IDs, sync missing cards from
 * YGOPRODeck, remap image-ID references, and remove unresolvable refs.
 *
 * Usage:
 *   pnpm fix-public-decks
 *   pnpm fix-public-decks --dry-run
 */
import "./bootstrap-env";
import { eq, inArray, sql } from "drizzle-orm";
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
import { publicDecks } from "@/db/schema/public-decks";
import type { DeckZoneRefs } from "@/features/decks/decks.schema";

const API_BASE = "https://db.ygoprodeck.com/api/v7";
const FETCH_BATCH = 50;

const dryRun = process.argv.includes("--dry-run");

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

async function fetchCardsByIds(ids: number[]): Promise<YgoCard[]> {
  if (ids.length === 0) return [];
  const url = `${API_BASE}/cardinfo.php?id=${ids.join(",")}`;
  const res = await fetch(url, { headers: { "User-Agent": "DeckForge/1.0" } });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: YgoCard[]; error?: string };
  if (!json.data) return [];
  return json.data;
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

function collectIds(zones: DeckZoneRefs[]): number[] {
  const ids = new Set<number>();
  for (const zone of zones) {
    for (const ref of zone) ids.add(ref.id);
  }
  return [...ids];
}

function remapZone(
  zone: DeckZoneRefs,
  remap: Map<number, number>,
  known: Set<number>
): { zone: DeckZoneRefs; removed: number[]; remapped: Array<{ from: number; to: number }> } {
  const removed: number[] = [];
  const remapped: Array<{ from: number; to: number }> = [];
  const merged = new Map<number, number>();

  for (const ref of zone) {
    let id = ref.id;
    if (!known.has(id)) {
      if (remap.has(id)) {
        remapped.push({ from: id, to: remap.get(id)! });
        id = remap.get(id)!;
      } else {
        removed.push(ref.id);
        continue;
      }
    }
    if (!known.has(id)) {
      removed.push(ref.id);
      continue;
    }
    merged.set(id, (merged.get(id) ?? 0) + ref.quantity);
  }

  const next = [...merged.entries()].map(([id, quantity]) => ({ id, quantity }));
  return { zone: next, removed, remapped };
}

function zonesChanged(before: DeckZoneRefs, after: DeckZoneRefs): boolean {
  if (before.length !== after.length) return true;
  const a = [...before].sort((x, y) => x.id - y.id || x.quantity - y.quantity);
  const b = [...after].sort((x, y) => x.id - y.id || x.quantity - y.quantity);
  return a.some((ref, i) => ref.id !== b[i]?.id || ref.quantity !== b[i]?.quantity);
}

async function main() {
  const records = await db.select().from(publicDecks);
  console.log(`Scanning ${records.length} public decks…\n`);

  const allIds = collectIds(records.flatMap((deck) => [deck.main, deck.extra, deck.side]));
  const uniqueIds = [...new Set(allIds)];
  console.log(`Unique card refs: ${uniqueIds.length}`);

  const existing = await db
    .select({ id: cards.id })
    .from(cards)
    .where(inArray(cards.id, uniqueIds));
  const known = new Set(existing.map((row) => row.id));
  let missing = uniqueIds.filter((id) => !known.has(id));
  console.log(`Missing in DB: ${missing.length}`);

  const remap = new Map<number, number>();
  if (missing.length > 0) {
    const imageRows = await db
      .select({ cardId: cardImages.cardId, imageId: cardImages.imageId })
      .from(cardImages)
      .where(inArray(cardImages.imageId, missing));

    for (const row of imageRows) {
      remap.set(row.imageId, row.cardId);
      known.add(row.cardId);
    }
    if (remap.size > 0) {
      console.log(`Image-ID remaps available: ${remap.size}`);
      missing = missing.filter((id) => !remap.has(id));
    }
  }

  let synced = 0;
  if (missing.length > 0) {
    console.log(`Fetching ${missing.length} cards from YGOPRODeck…`);
    const syncedAt = new Date();
    for (let i = 0; i < missing.length; i += FETCH_BATCH) {
      const batchIds = missing.slice(i, i + FETCH_BATCH);
      const fetched = await fetchCardsByIds(batchIds);
      if (fetched.length > 0 && !dryRun) {
        await syncCardBatch(fetched, syncedAt);
      }
      for (const card of fetched) known.add(card.id);
      synced += fetched.length;
      console.log(`  fetched ${Math.min(i + FETCH_BATCH, missing.length)} / ${missing.length}`);
      await new Promise((r) => setTimeout(r, 120));
    }
    console.log(`Synced ${synced} cards from API`);
    missing = missing.filter((id) => !known.has(id));
  }

  if (missing.length > 0) {
    console.log(`Still unresolved (will remove from decks): ${missing.length}`);
    console.log(missing.slice(0, 20).join(", ") + (missing.length > 20 ? "…" : ""));
  }

  let updatedDecks = 0;
  let totalRemoved = 0;
  let totalRemapped = 0;
  const problemDecks: Array<{ slug: string; name: string; removed: number[]; remapped: number }> = [];

  for (const deck of records) {
    const main = remapZone(deck.main, remap, known);
    const extra = remapZone(deck.extra, remap, known);
    const side = remapZone(deck.side, remap, known);

    const removed = [...main.removed, ...extra.removed, ...side.removed];
    const remappedCount =
      main.remapped.length + extra.remapped.length + side.remapped.length;

    const changed =
      zonesChanged(deck.main, main.zone) ||
      zonesChanged(deck.extra, extra.zone) ||
      zonesChanged(deck.side, side.zone);

    if (!changed) continue;

    totalRemoved += removed.length;
    totalRemapped += remappedCount;
    updatedDecks++;
    problemDecks.push({
      slug: deck.slug,
      name: deck.name,
      removed,
      remapped: remappedCount,
    });

    if (!dryRun) {
      await db
        .update(publicDecks)
        .set({
          main: main.zone,
          extra: extra.zone,
          side: side.zone,
          updatedAt: new Date(),
        })
        .where(eq(publicDecks.id, deck.id));
    }
  }

  console.log(`\nDecks updated: ${updatedDecks}`);
  console.log(`Refs remapped (image → card): ${totalRemapped}`);
  console.log(`Refs removed: ${totalRemoved}`);

  if (problemDecks.length > 0) {
    console.log("\nAffected decks:");
    for (const deck of problemDecks.slice(0, 30)) {
      const parts = [];
      if (deck.remapped > 0) parts.push(`${deck.remapped} remapped`);
      if (deck.removed.length > 0) parts.push(`removed ${deck.removed.join(",")}`);
      console.log(`  ${deck.slug} — ${deck.name} (${parts.join("; ")})`);
    }
    if (problemDecks.length > 30) {
      console.log(`  …and ${problemDecks.length - 30} more`);
    }
  }

  if (dryRun) console.log("\nDry run — no database writes.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
