import type { PublicDeckRecord } from "@/db/schema/public-decks";
import {
  findPublicDeckById,
  findPublicDeckBySlug,
  findPublicDeckCategories,
  findPublicDecks,
  findPublicDecksPage,
  type PublicDeckCategoryRow,
  type PublicDeckPage,
  type PublicDeckQuery,
} from "@/features/public-decks/public-decks.repository";

export type { PublicDeckPage, PublicDeckQuery, PublicDeckCategoryRow };

export async function getPublicDecks(): Promise<PublicDeckRecord[]> {
  return findPublicDecks();
}

export async function getPublicDecksPage(options: PublicDeckQuery = {}): Promise<PublicDeckPage> {
  return findPublicDecksPage(options);
}

export async function getPublicDeckCategories(): Promise<PublicDeckCategoryRow[]> {
  return findPublicDeckCategories();
}

export async function getPublicDeckById(id: string): Promise<PublicDeckRecord | null> {
  return findPublicDeckById(id);
}

export async function getPublicDeckBySlug(slug: string): Promise<PublicDeckRecord | null> {
  return findPublicDeckBySlug(slug);
}
