import type { PublicDeckRecord } from "@/db/schema/public-decks";
import {
  findPublicDeckById,
  findPublicDeckBySlug,
  findPublicDecks,
} from "@/features/public-decks/public-decks.repository";

export async function getPublicDecks(): Promise<PublicDeckRecord[]> {
  return findPublicDecks();
}

export async function getPublicDeckById(id: string): Promise<PublicDeckRecord | null> {
  return findPublicDeckById(id);
}

export async function getPublicDeckBySlug(slug: string): Promise<PublicDeckRecord | null> {
  return findPublicDeckBySlug(slug);
}
