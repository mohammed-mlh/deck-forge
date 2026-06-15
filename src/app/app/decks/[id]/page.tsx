import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDeckDetail } from "@/app/decks/[id]/content";
import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDeckById } from "@/features/decks/decks.service";
import { buildDeckMetadata } from "@/lib/decks/deck-metadata";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) return { title: "Deck not found" };
  return buildDeckMetadata(deckRecordToSavedDeck(record));
}

export default async function PublicDeckPage({ params }: Props) {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) notFound();

  const deck = deckRecordToSavedDeck(record);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PublicDeckDetail deck={deck} />
    </div>
  );
}
