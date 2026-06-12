import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { decks, type NewDeckRecord } from "@/db/schema/decks";
import type { DeckRecord } from "@/db/schema/decks";

export async function findDeckById(deckId: string): Promise<DeckRecord | null> {
  const rows = await db.select().from(decks).where(eq(decks.id, deckId)).limit(1);
  return rows[0] ?? null;
}

export async function findDecksByUserId(userId: string): Promise<DeckRecord[]> {
  return db
    .select()
    .from(decks)
    .where(eq(decks.userId, userId))
    .orderBy(desc(decks.updatedAt));
}

export async function insertDeck(values: NewDeckRecord): Promise<DeckRecord> {
  const rows = await db.insert(decks).values(values).returning();
  return rows[0];
}

export async function updateDeckById(
  deckId: string,
  userId: string,
  patch: Partial<NewDeckRecord>
): Promise<DeckRecord | null> {
  const rows = await db
    .update(decks)
    .set(patch)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .returning();

  return rows[0] ?? null;
}

export async function deleteDeckById(deckId: string, userId: string): Promise<boolean> {
  const rows = await db
    .delete(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .returning({ id: decks.id });

  return rows.length > 0;
}
