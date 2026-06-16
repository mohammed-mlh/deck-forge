import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const banlistFormatEnum = pgEnum("banlist_format", [
  "tcg",
  "ocg",
  "goat",
  "master_duel",
  "speed_duel",
  "duel_links",
]);

export const cards = pgTable("cards", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  humanReadableCardType: text("human_readable_card_type"),
  frameType: text("frame_type").notNull(),
  desc: text("desc").notNull(),
  race: text("race"),
  attribute: text("attribute"),
  atk: integer("atk"),
  def: integer("def"),
  level: integer("level"),
  rank: integer("rank"),
  linkval: integer("linkval"),
  scale: integer("scale"),
  archetype: text("archetype"),
  typeline: text("typeline").array(),
  linkMarkers: text("link_markers").array(),
  ygoprodeckUrl: text("ygoprodeck_url"),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cardImages = pgTable(
  "card_images",
  {
    cardId: integer("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    imageId: integer("image_id").notNull(),
    imageUrl: text("image_url").notNull(),
    imageUrlSmall: text("image_url_small").notNull(),
    imageUrlCropped: text("image_url_cropped").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.cardId, table.imageId] }),
    index("card_images_card_id_idx").on(table.cardId),
  ]
);

export const cardSets = pgTable(
  "card_sets",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    cardId: integer("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    setName: text("set_name").notNull(),
    setCode: text("set_code").notNull(),
    setRarity: text("set_rarity").notNull(),
    setRarityCode: text("set_rarity_code"),
    setPrice: numeric("set_price", { precision: 12, scale: 2 }),
  },
  (table) => [
    index("card_sets_card_id_idx").on(table.cardId),
    uniqueIndex("card_sets_card_set_code_rarity_idx").on(
      table.cardId,
      table.setCode,
      table.setRarity
    ),
  ]
);

export const cardPrices = pgTable("card_prices", {
  cardId: integer("card_id")
    .primaryKey()
    .references(() => cards.id, { onDelete: "cascade" }),
  cardmarketPrice: numeric("cardmarket_price", { precision: 12, scale: 2 }),
  tcgplayerPrice: numeric("tcgplayer_price", { precision: 12, scale: 2 }),
  ebayPrice: numeric("ebay_price", { precision: 12, scale: 2 }),
  amazonPrice: numeric("amazon_price", { precision: 12, scale: 2 }),
  coolstuffincPrice: numeric("coolstuffinc_price", { precision: 12, scale: 2 }),
});

export const banlistEntries = pgTable(
  "banlist_entries",
  {
    cardId: integer("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    format: banlistFormatEnum("format").notNull(),
    status: text("status").notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.cardId, table.format] }),
    index("banlist_entries_format_idx").on(table.format),
  ]
);

export type CardRecord = typeof cards.$inferSelect;
export type NewCardRecord = typeof cards.$inferInsert;
export type BanlistEntryRecord = typeof banlistEntries.$inferSelect;
export type NewBanlistEntryRecord = typeof banlistEntries.$inferInsert;
