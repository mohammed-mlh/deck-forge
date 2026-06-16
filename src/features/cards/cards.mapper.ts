import type { BanlistEntryRecord, CardRecord } from "@/db/schema/cards";
import type { CardImageRecord, CardSetRecord } from "@/features/cards/cards.repository";
import type { CardDetail, CardPriceView, CardSetView } from "@/features/cards/cards.schema";
import type { YugiohCard, YugiohCardImage } from "@/types/yugioh";

function mapImages(images: CardImageRecord[]): YugiohCardImage[] {
  return images.map((image) => ({
    id: image.imageId,
    image_url: image.imageUrl,
    image_url_small: image.imageUrlSmall,
    image_url_cropped: image.imageUrlCropped,
  }));
}

export function cardRecordToYugiohCard(
  record: CardRecord,
  images: CardImageRecord[] = []
): YugiohCard {
  return {
    id: record.id,
    name: record.name,
    type: record.type,
    desc: record.desc,
    race: record.race ?? undefined,
    attribute: record.attribute ?? undefined,
    atk: record.atk ?? undefined,
    def: record.def ?? undefined,
    level: record.level ?? undefined,
    rank: record.rank ?? undefined,
    linkval: record.linkval ?? undefined,
    scale: record.scale ?? undefined,
    archetype: record.archetype ?? undefined,
    frameType: record.frameType,
    card_images: mapImages(images),
  };
}

export function cardRecordsToYugiohCards(
  records: CardRecord[],
  imagesByCardId: Map<number, CardImageRecord[]>
): YugiohCard[] {
  return records.map((record) =>
    cardRecordToYugiohCard(record, imagesByCardId.get(record.id) ?? [])
  );
}

function mapSets(sets: CardSetRecord[]): CardSetView[] {
  return sets.map((set) => ({
    setName: set.setName,
    setCode: set.setCode,
    setRarity: set.setRarity,
    setRarityCode: set.setRarityCode,
    setPrice: set.setPrice,
  }));
}

function mapBanlist(entries: BanlistEntryRecord[]): CardDetail["banlist"] {
  const banlist: CardDetail["banlist"] = {};
  for (const entry of entries) {
    banlist[entry.format] = entry.status;
  }
  return banlist;
}

export function cardRecordToDetail(
  record: CardRecord,
  images: CardImageRecord[],
  sets: CardSetRecord[],
  prices: CardPriceView | null,
  banlistEntries: BanlistEntryRecord[]
): CardDetail {
  return {
    ...cardRecordToYugiohCard(record, images),
    humanReadableCardType: record.humanReadableCardType,
    typeline: record.typeline ?? undefined,
    linkMarkers: record.linkMarkers ?? undefined,
    ygoprodeckUrl: record.ygoprodeckUrl,
    syncedAt: record.syncedAt.toISOString(),
    prices,
    sets: mapSets(sets),
    banlist: mapBanlist(banlistEntries),
  };
}
