import type { BanlistEntryRecord, CardImageRecord, CardRecord } from "@/db/schema/cards";
import type { CardIdsInput, CardSearchInput } from "@/features/cards/cards.schema";
import { cardSearchSchema } from "@/features/cards/cards.schema";
import {
  findBanlistByCardId,
  findCardById,
  findCardsByIds,
  findCoverCardIdsByArchetypes,
  findImagesByCardIds,
  findPriceByCardId,
  findSetsByCardId,
  groupImagesByCardId,
  searchCards,
} from "@/features/cards/cards.repository";
import type { Card, CardDetail, CardImage } from "@/features/cards/cards.schema";

function toCardImage(image: CardImageRecord): CardImage {
  return {
    imageId: image.imageId,
    imageUrl: image.imageUrl,
    imageUrlSmall: image.imageUrlSmall,
    imageUrlCropped: image.imageUrlCropped,
  };
}

function toCard(record: CardRecord, images: CardImageRecord[]): Card {
  return {
    ...record,
    syncedAt: record.syncedAt.toISOString(),
    images: images.map(toCardImage),
  };
}

function toBanlistMap(entries: BanlistEntryRecord[]): CardDetail["banlist"] {
  const banlist: CardDetail["banlist"] = {};
  for (const entry of entries) {
    banlist[entry.format] = entry.status;
  }
  return banlist;
}

function toCards(records: CardRecord[], images: CardImageRecord[]): Card[] {
  const imagesByCardId = groupImagesByCardId(images);
  return records.map((record) => toCard(record, imagesByCardId.get(record.id) ?? []));
}

async function loadCardsByIds(ids: number[]): Promise<Card[]> {
  if (ids.length === 0) return [];

  const records = await findCardsByIds(ids);
  const images = await findImagesByCardIds(ids);
  const byId = new Map(toCards(records, images).map((card) => [card.id, card]));

  return ids
    .map((id) => byId.get(id))
    .filter((card): card is Card => Boolean(card));
}

export async function getCards(input: CardSearchInput = {}): Promise<Card[]> {
  const query = cardSearchSchema.parse(input);
  const records = await searchCards(query);
  const images = await findImagesByCardIds(records.map((record) => record.id));
  return toCards(records, images);
}

export async function getCardsByIds(input: CardIdsInput): Promise<Card[]> {
  return loadCardsByIds(input.ids);
}

export async function getCoverCardIdsByArchetypes(names: string[]): Promise<Map<string, number>> {
  return findCoverCardIdsByArchetypes(names);
}

export async function getCardById(cardId: number): Promise<CardDetail | null> {
  const record = await findCardById(cardId);
  if (!record) return null;

  const [images, sets, prices, banlist] = await Promise.all([
    findImagesByCardIds([cardId]),
    findSetsByCardId(cardId),
    findPriceByCardId(cardId),
    findBanlistByCardId(cardId),
  ]);

  return {
    ...toCard(record, images),
    sets,
    prices,
    banlist: toBanlistMap(banlist),
  };
}
