export interface YugiohCardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface YugiohCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  race?: string;
  attribute?: string;
  atk?: number;
  def?: number;
  level?: number;
  rank?: number;
  linkval?: number;
  scale?: number;
  archetype?: string;
  frameType: string;
  card_images: YugiohCardImage[];
}

export interface YugiohApiResponse {
  data: YugiohCard[];
}

export type CardTypeFilter = "all" | "monster" | "spell" | "trap";

export interface CardSearchParams {
  name?: string;
  type?: CardTypeFilter;
  attribute?: string;
  levelMin?: string;
  levelMax?: string;
  atkMin?: string;
  atkMax?: string;
  defMin?: string;
  defMax?: string;
  linkMin?: string;
  linkMax?: string;
  scaleMin?: string;
  scaleMax?: string;
  frameType?: string;
  linkmarker?: string;
  archetype?: string;
  race?: string;
  hasEffect?: boolean;
  num?: number;
  offset?: number;
}

export const CARD_ATTRIBUTES = [
  "DARK",
  "LIGHT",
  "EARTH",
  "WATER",
  "FIRE",
  "WIND",
  "DIVINE",
] as const;

export const CARD_LEVELS = Array.from({ length: 13 }, (_, i) => String(i));
