import {
  deleteDeckById,
  findDeckById,
  findDeckByUserSlug,
  findDecksByUserId,
  findPublicDeckById,
  findPublicDecks,
  insertDeck,
  updateDeckById,
} from "@/features/decks/decks.repository";
import type { NewDeckRecord, DeckRecord } from "@/db/schema/decks";
import type { CreateDeckInput, UpdateDeckInput } from "@/features/decks/decks.schema";
import { validateDeckRefs } from "@/lib/deck-rules";

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

function assertValidDeckInput(input: Pick<CreateDeckInput, "main" | "extra" | "side">) {
  const issues = validateDeckRefs(input.main ?? [], input.extra ?? [], input.side ?? []);
  const errors = issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    throw new Error(errors[0]?.message ?? "Invalid deck");
  }
}

async function uniqueSlug(userId: string, name: string): Promise<string> {
  let slug = defaultSlug(name);
  let suffix = 2;

  while (await findDeckByUserSlug(userId, slug)) {
    slug = `${defaultSlug(name).slice(0, 58)}-${suffix}`;
    suffix++;
  }

  return slug;
}

export async function getDeckById(userId: string, deckId: string): Promise<DeckRecord | null> {
  const deck = await findDeckById(deckId);
  if (!deck || deck.userId !== userId) return null;
  return deck;
}

export async function getUserDecks(userId: string): Promise<DeckRecord[]> {
  return findDecksByUserId(userId);
}

export async function getPublicDecks(): Promise<DeckRecord[]> {
  return findPublicDecks();
}

export async function getPublicDeckById(deckId: string): Promise<DeckRecord | null> {
  return findPublicDeckById(deckId);
}

export async function createDeck(userId: string, input: CreateDeckInput): Promise<DeckRecord> {
  assertValidDeckInput(input);

  const slug = input.slug ? slugify(input.slug) : await uniqueSlug(userId, input.name);

  const values: NewDeckRecord = {
    ...(input.id ? { id: input.id } : {}),
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

export async function forkDeck(userId: string, input: CreateDeckInput): Promise<DeckRecord> {
  return createDeck(userId, {
    ...input,
    name: input.name.trim(),
    slug: undefined,
  });
}

export async function updateDeck(
  userId: string,
  deckId: string,
  input: UpdateDeckInput
): Promise<DeckRecord | null> {
  if (input.main !== undefined || input.extra !== undefined || input.side !== undefined) {
    const existing = await getDeckById(userId, deckId);
    if (!existing) return null;

    assertValidDeckInput({
      main: input.main ?? existing.main,
      extra: input.extra ?? existing.extra,
      side: input.side ?? existing.side,
    });
  }

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
