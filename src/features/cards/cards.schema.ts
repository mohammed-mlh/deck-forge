import { z } from "zod";
import type {
  BanlistEntryRecord,
  CardImageRecord,
  CardPriceRecord,
  CardRecord,
  CardSetRecord,
} from "@/db/schema/cards";

export const cardTypeFilterSchema = z.enum(["all", "monster", "spell", "trap"]);

export const cardSearchSchema = z.object({
  name: z.string().trim().optional(),
  type: cardTypeFilterSchema.optional(),
  attribute: z.string().trim().optional(),
  levelMin: z.coerce.number().int().min(0).max(13).optional(),
  levelMax: z.coerce.number().int().min(0).max(13).optional(),
  atkMin: z.coerce.number().int().min(0).optional(),
  atkMax: z.coerce.number().int().min(0).optional(),
  defMin: z.coerce.number().int().min(0).optional(),
  defMax: z.coerce.number().int().min(0).optional(),
  linkMin: z.coerce.number().int().min(1).max(8).optional(),
  linkMax: z.coerce.number().int().min(1).max(8).optional(),
  scaleMin: z.coerce.number().int().min(0).max(13).optional(),
  scaleMax: z.coerce.number().int().min(0).max(13).optional(),
  frameType: z.string().trim().optional(),
  linkmarker: z.string().trim().optional(),
  archetype: z.string().trim().optional(),
  race: z.string().trim().optional(),
  hasEffect: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
  num: z.coerce.number().int().min(1).max(100).optional().default(100),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const cardIdsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(200),
});

export type CardTypeFilter = z.infer<typeof cardTypeFilterSchema>;
export type CardSearchInput = z.input<typeof cardSearchSchema>;
export type CardSearchQuery = z.infer<typeof cardSearchSchema>;
export type CardIdsInput = z.infer<typeof cardIdsSchema>;

export type CardImage = Pick<
  CardImageRecord,
  "imageId" | "imageUrl" | "imageUrlSmall" | "imageUrlCropped"
>;

export type Card = Omit<CardRecord, "syncedAt"> & {
  syncedAt: string;
  images: CardImage[];
};

export type CardDetail = Card & {
  sets: CardSetRecord[];
  prices: CardPriceRecord | null;
  banlist: Partial<Record<BanlistEntryRecord["format"], string>>;
};

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
