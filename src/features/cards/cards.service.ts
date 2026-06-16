import {
  cardRecordToDetail,
  cardRecordsToYugiohCards,
  cardRecordToYugiohCard,
} from "@/features/cards/cards.mapper";
import type { CardDetail, CardIdsInput, CardSearchQuery } from "@/features/cards/cards.schema";
import {
  findBanlistByCardId,
  findCardById,
  findCardsByIds,
  findDistinctArchetypes,
  findImagesByCardIds,
  findPriceByCardId,
  findSetsByCardId,
  groupImagesByCardId,
  searchCards,
} from "@/features/cards/cards.repository";
import type { YugiohCard } from "@/types/yugioh";

async function loadCardsWithImages(cardIds: number[]): Promise<YugiohCard[]> {
  if (cardIds.length === 0) return [];

  const records = await findCardsByIds(cardIds);
  const images = await findImagesByCardIds(cardIds);
  const imagesByCardId = groupImagesByCardId(images);
  const byId = new Map(records.map((record) => [record.id, record]));

  return cardIds
    .map((id) => byId.get(id))
    .filter((record): record is NonNullable<typeof record> => Boolean(record))
    .map((record) => cardRecordToYugiohCard(record, imagesByCardId.get(record.id) ?? []));
}

export async function getCards(input: CardSearchQuery): Promise<YugiohCard[]> {
  const records = await searchCards(input);
  const images = await findImagesByCardIds(records.map((record) => record.id));
  return cardRecordsToYugiohCards(records, groupImagesByCardId(images));
}

export async function getCardsByIds(input: CardIdsInput): Promise<YugiohCard[]> {
  return loadCardsWithImages(input.ids);
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

  return cardRecordToDetail(record, images, sets, prices, banlist);
}

export async function getArchetypes(): Promise<string[]> {
  return findDistinctArchetypes();
}
