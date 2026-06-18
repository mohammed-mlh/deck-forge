import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { publicDecks, type PublicDeckRecord } from "@/db/schema/public-decks";

export async function findPublicDecks(): Promise<PublicDeckRecord[]> {
  return db.select().from(publicDecks).orderBy(desc(publicDecks.updatedAt));
}

export async function findPublicDeckById(id: string): Promise<PublicDeckRecord | null> {
  const rows = await db.select().from(publicDecks).where(eq(publicDecks.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findPublicDeckBySlug(slug: string): Promise<PublicDeckRecord | null> {
  const rows = await db.select().from(publicDecks).where(eq(publicDecks.slug, slug)).limit(1);
  return rows[0] ?? null;
}
