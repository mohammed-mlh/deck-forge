import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { decks, type DeckRecord, type NewDeckRecord } from "@/db/schema/decks";
import type { DeckZoneRefs } from "@/db/schema/types";

export type DeckVisibility = "private" | "unlisted" | "public";

export interface CreateDeckInput {
  name: string;
  slug?: string;
  visibility?: DeckVisibility;
  main?: DeckZoneRefs;
  extra?: DeckZoneRefs;
  side?: DeckZoneRefs;
}

export interface UpdateDeckInput {
  name?: string;
  slug?: string;
  visibility?: DeckVisibility;
  main?: DeckZoneRefs;
  extra?: DeckZoneRefs;
  side?: DeckZoneRefs;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function defaultSlug(name: string): string {
  const base = slugify(name);
  return base || "deck";
}

export async function getDeckById(userId: string, deckId: string): Promise<DeckRecord | null> {
  const rows = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function getUserDecks(userId: string): Promise<DeckRecord[]> {
  return db
    .select()
    .from(decks)
    .where(eq(decks.userId, userId))
    .orderBy(desc(decks.updatedAt));
}

export async function createDeck(userId: string, input: CreateDeckInput): Promise<DeckRecord> {
  const slug = input.slug ? slugify(input.slug) : defaultSlug(input.name);

  const values: NewDeckRecord = {
    userId,
    name: input.name.trim(),
    slug,
    visibility: input.visibility ?? "private",
    main: input.main ?? [],
    extra: input.extra ?? [],
    side: input.side ?? [],
  };

  const rows = await db.insert(decks).values(values).returning();
  return rows[0];
}

export async function updateDeck(
  userId: string,
  deckId: string,
  input: UpdateDeckInput
): Promise<DeckRecord | null> {
  const patch: Partial<NewDeckRecord> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.slug !== undefined) patch.slug = slugify(input.slug);
  if (input.visibility !== undefined) patch.visibility = input.visibility;
  if (input.main !== undefined) patch.main = input.main;
  if (input.extra !== undefined) patch.extra = input.extra;
  if (input.side !== undefined) patch.side = input.side;

  const rows = await db
    .update(decks)
    .set(patch)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .returning();

  return rows[0] ?? null;
}

export async function deleteDeck(userId: string, deckId: string): Promise<boolean> {
  const rows = await db
    .delete(decks)
    .where(and(eq(decks.id, deckId), eq(decks.userId, userId)))
    .returning({ id: decks.id });

  return rows.length > 0;
}
