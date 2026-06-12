import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  deckAnalyses,
  type NewDeckAnalysisRecord,
} from "@/db/schema/deck-analyses";
import type { DeckAnalysisRecord } from "@/db/schema/deck-analyses";

export async function findDeckAnalysesByDeckId(deckId: string): Promise<DeckAnalysisRecord[]> {
  return db
    .select()
    .from(deckAnalyses)
    .where(eq(deckAnalyses.deckId, deckId))
    .orderBy(desc(deckAnalyses.createdAt));
}

export async function insertDeckAnalysis(
  values: NewDeckAnalysisRecord
): Promise<DeckAnalysisRecord> {
  const rows = await db.insert(deckAnalyses).values(values).returning();
  return rows[0];
}
