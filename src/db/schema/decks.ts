import { jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { DeckZoneRefs } from "@/features/decks/decks.schema";

export const deckVisibilityEnum = pgEnum("deck_visibility", [
  "private",
  "unlisted",
  "public",
]);

export const decks = pgTable(
  "decks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    visibility: deckVisibilityEnum("visibility").notNull().default("private"),
    main: jsonb("main").notNull().$type<DeckZoneRefs>(),
    extra: jsonb("extra").notNull().$type<DeckZoneRefs>(),
    side: jsonb("side").notNull().$type<DeckZoneRefs>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("decks_user_slug_idx").on(table.userId, table.slug)]
);

export type DeckRecord = typeof decks.$inferSelect;
export type NewDeckRecord = typeof decks.$inferInsert;
