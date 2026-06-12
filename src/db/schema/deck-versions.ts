import { integer, jsonb, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { decks } from "@/db/schema/decks";
import type { DeckZoneRefs } from "@/db/schema/types";

export const deckVersions = pgTable(
  "deck_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deckId: uuid("deck_id")
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    main: jsonb("main").notNull().$type<DeckZoneRefs>(),
    extra: jsonb("extra").notNull().$type<DeckZoneRefs>(),
    side: jsonb("side").notNull().$type<DeckZoneRefs>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("deck_versions_deck_version_idx").on(table.deckId, table.versionNumber)]
);

export type DeckVersionRecord = typeof deckVersions.$inferSelect;
export type NewDeckVersionRecord = typeof deckVersions.$inferInsert;
