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
import type { CreateDeckInput, DeckZoneRefs, UpdateDeckInput } from "@/features/decks/decks.schema";
import { deckFromRefs, validateDeck, validateDeckRefs } from "@/lib/deck-rules";
import { getCardsByIds } from "@/features/cards/cards.service";

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

function collectRefIds(main: DeckZoneRefs, extra: DeckZoneRefs, side: DeckZoneRefs): number[] {
  const ids = new Set<number>();
  for (const refs of [main, extra, side]) {
    for (const ref of refs) ids.add(ref.id);
  }
  return [...ids];
}

async function assertValidDeckInput(
  input: Pick<CreateDeckInput, "main" | "extra" | "side">
) {
  const main = input.main ?? [];
  const extra = input.extra ?? [];
  const side = input.side ?? [];

  const issues = validateDeckRefs(main, extra, side);

  const ids = collectRefIds(main, extra, side);
  if (ids.length > 0) {
    const cards = await getCardsByIds({ ids });
    const byId = new Map(cards.map((card) => [card.id, card]));
    const deck = deckFromRefs(main, extra, side, byId);
    issues.push(...validateDeck(deck));
  }

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
  await assertValidDeckInput(input);

  const slug = input.slug ? slugify(input.slug) : await uniqueSlug(userId, input.name);

  const values: NewDeckRecord = {
    ...(input.id ? { id: input.id } : {}),
    userId,
    name: input.name.trim(),
    slug,
    visibility: "private",
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

    await assertValidDeckInput({
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
  if (input.main !== undefined) patch.main = input.main;
  if (input.extra !== undefined) patch.extra = input.extra;
  if (input.side !== undefined) patch.side = input.side;

  return updateDeckById(deckId, userId, patch);
}

export async function deleteDeck(userId: string, deckId: string): Promise<boolean> {
  return deleteDeckById(deckId, userId);
}
