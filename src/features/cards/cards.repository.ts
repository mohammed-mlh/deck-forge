import {
  and,
  arrayOverlaps,
  asc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  CardPriceRecord,
  CardSetRecord,
  banlistEntries,
  cardImages,
  cardPrices,
  cardSets,
  cards,
  type BanlistEntryRecord,
  type CardImageRecord,
  type CardRecord,
} from "@/db/schema/cards";
import type { CardSearchQuery } from "@/features/cards/cards.schema";
import { buildCardNameSearchCondition, buildFlexibleTextSearchCondition } from "@/features/cards/card-search";

function buildSearchConditions(params: CardSearchQuery) {
  const conditions = [];

  if (params.name) {
    const nameCondition = buildCardNameSearchCondition(params.name);
    if (nameCondition) conditions.push(nameCondition);
  }

  if (params.type === "spell") {
    conditions.push(like(cards.type, "%Spell%"));
  } else if (params.type === "trap") {
    conditions.push(like(cards.type, "%Trap%"));
  } else if (params.type === "monster") {
    conditions.push(like(cards.type, "%Monster%"));
  }

  if (params.attribute) {
    conditions.push(eq(cards.attribute, params.attribute));
  }

  if (params.archetype) {
    const archetypeCondition = buildFlexibleTextSearchCondition(cards.archetype, params.archetype);
    if (archetypeCondition) conditions.push(archetypeCondition);
  }

  if (params.race) {
    conditions.push(eq(cards.race, params.race));
  }

  if (params.frameType) {
    const frames = params.frameType.split(",").map((value) => value.trim()).filter(Boolean);
    if (frames.length === 1) {
      conditions.push(eq(cards.frameType, frames[0]!));
    } else if (frames.length > 1) {
      conditions.push(inArray(cards.frameType, frames));
    }
  }

  if (params.linkmarker) {
    const markers = params.linkmarker.split(",").map((value) => value.trim()).filter(Boolean);
    if (markers.length > 0) {
      conditions.push(arrayOverlaps(cards.linkMarkers, markers));
    }
  }

  if (params.hasEffect) {
    conditions.push(like(cards.type, "%Effect%"));
  }

  if (params.levelMin !== undefined) {
    conditions.push(
      or(gte(cards.level, params.levelMin), gte(cards.rank, params.levelMin))!
    );
  }

  if (params.levelMax !== undefined) {
    conditions.push(
      or(lte(cards.level, params.levelMax), lte(cards.rank, params.levelMax))!
    );
  }

  if (params.atkMin !== undefined) {
    conditions.push(gte(cards.atk, params.atkMin));
  }

  if (params.atkMax !== undefined) {
    conditions.push(lte(cards.atk, params.atkMax));
  }

  if (params.defMin !== undefined) {
    conditions.push(gte(cards.def, params.defMin));
  }

  if (params.defMax !== undefined) {
    conditions.push(lte(cards.def, params.defMax));
  }

  if (params.linkMin !== undefined) {
    conditions.push(gte(cards.linkval, params.linkMin));
  }

  if (params.linkMax !== undefined) {
    conditions.push(lte(cards.linkval, params.linkMax));
  }

  if (params.scaleMin !== undefined) {
    conditions.push(gte(cards.scale, params.scaleMin));
  }

  if (params.scaleMax !== undefined) {
    conditions.push(lte(cards.scale, params.scaleMax));
  }

  return conditions;
}

export async function findCardById(cardId: number): Promise<CardRecord | null> {
  const rows = await db.select().from(cards).where(eq(cards.id, cardId)).limit(1);
  return rows[0] ?? null;
}

export async function findCardsByIds(cardIds: number[]): Promise<CardRecord[]> {
  if (cardIds.length === 0) return [];
  return db.select().from(cards).where(inArray(cards.id, cardIds));
}

export async function searchCards(params: CardSearchQuery): Promise<CardRecord[]> {
  const conditions = buildSearchConditions(params);
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(cards)
    .where(where)
    .orderBy(asc(cards.name))
    .limit(params.num)
    .offset(params.offset);
}

export async function findImagesByCardIds(cardIds: number[]): Promise<CardImageRecord[]> {
  if (cardIds.length === 0) return [];
  return db
    .select()
    .from(cardImages)
    .where(inArray(cardImages.cardId, cardIds))
    .orderBy(asc(cardImages.imageId));
}

export async function findSetsByCardId(cardId: number): Promise<CardSetRecord[]> {
  return db
    .select()
    .from(cardSets)
    .where(eq(cardSets.cardId, cardId))
    .orderBy(asc(cardSets.setName));
}

export async function findPriceByCardId(cardId: number): Promise<CardPriceRecord | null> {
  const rows = await db.select().from(cardPrices).where(eq(cardPrices.cardId, cardId)).limit(1);
  return rows[0] ?? null;
}

export async function findBanlistByCardId(cardId: number): Promise<BanlistEntryRecord[]> {
  return db.select().from(banlistEntries).where(eq(banlistEntries.cardId, cardId));
}

export function groupImagesByCardId(
  images: CardImageRecord[]
): Map<number, CardImageRecord[]> {
  const grouped = new Map<number, CardImageRecord[]>();
  for (const image of images) {
    const existing = grouped.get(image.cardId) ?? [];
    existing.push(image);
    grouped.set(image.cardId, existing);
  }
  return grouped;
}

/** One representative card id per archetype name (for list cover art). */
export async function findCoverCardIdsByArchetypes(
  names: string[]
): Promise<Map<string, number>> {
  if (names.length === 0) return new Map();

  const rows = await db
    .select({
      archetype: cards.archetype,
      cardId: sql<number>`min(${cards.id})`,
    })
    .from(cards)
    .where(and(isNotNull(cards.archetype), inArray(cards.archetype, names)))
    .groupBy(cards.archetype);

  const map = new Map<string, number>();
  for (const row of rows) {
    if (row.archetype) map.set(row.archetype, Number(row.cardId));
  }
  return map;
}
