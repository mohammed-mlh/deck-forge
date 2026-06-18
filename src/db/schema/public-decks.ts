import { jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { DeckZoneRefs } from "@/features/decks/decks.schema";

export const publicDeckStatusEnum = pgEnum("public_deck_status", ["published", "draft"]);

export interface PublicDeckMetadata {
  category: string;
  format: string;
  author: string;
  views: number;
  price: number;
  coverCard: number;
  tournament: { name: string; player: string | null } | null;
  youtube: string | null;
  source: string;
}

export const publicDecks = pgTable(
  "public_decks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    main: jsonb("main").notNull().$type<DeckZoneRefs>(),
    extra: jsonb("extra").notNull().$type<DeckZoneRefs>(),
    side: jsonb("side").notNull().$type<DeckZoneRefs>(),
    status: publicDeckStatusEnum("status").notNull().default("draft"),
    metadata: jsonb("metadata").$type<PublicDeckMetadata>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("public_decks_slug_idx").on(table.slug)]
);

export type PublicDeckRecord = typeof publicDecks.$inferSelect;
export type NewPublicDeckRecord = typeof publicDecks.$inferInsert;
