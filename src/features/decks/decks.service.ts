import {
  deleteDeckById,
  findDeckById,
  findDecksByUserId,
  insertDeck,
  updateDeckById,
} from "@/features/decks/decks.repository";
import type { NewDeckRecord, DeckRecord } from "@/db/schema/decks";
import type { CreateDeckInput, UpdateDeckInput } from "@/features/decks/decks.schema";

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
  const deck = await findDeckById(deckId);
  if (!deck || deck.userId !== userId) return null;
  return deck;
}

export async function getUserDecks(userId: string): Promise<DeckRecord[]> {
  return findDecksByUserId(userId);
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

  return insertDeck(values);
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

  return updateDeckById(deckId, userId, patch);
}

export async function deleteDeck(userId: string, deckId: string): Promise<boolean> {
  return deleteDeckById(deckId, userId);
}
