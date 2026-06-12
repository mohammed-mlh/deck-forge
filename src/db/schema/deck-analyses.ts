import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import type { DeckAnalysis } from "@/lib/ai/types";
import { decks } from "@/db/schema/decks";

export const deckAnalyses = pgTable("deck_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  deckId: uuid("deck_id")
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }),
  analysis: jsonb("analysis").notNull().$type<DeckAnalysis>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DeckAnalysisRecord = typeof deckAnalyses.$inferSelect;
export type NewDeckAnalysisRecord = typeof deckAnalyses.$inferInsert;
