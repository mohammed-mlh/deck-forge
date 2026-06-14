import type { Metadata } from "next";
import { buildDeckMetadata } from "@/lib/decks/deck-metadata";
import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDeckById } from "@/features/decks/decks.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) return { title: "Deck" };
  return buildDeckMetadata(deckRecordToSavedDeck(record));
}

export default function PublicDeckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
