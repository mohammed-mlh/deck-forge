import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDeckDetail } from "@/app/decks/[id]/content";
import { toSavedDeck } from "@/features/decks/decks.service";
import { getPublicDeckById } from "@/features/public-decks/public-decks.service";
import { buildDeckMetadata } from "@/lib/decks/deck-metadata";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) return { title: "Deck not found" };
  return buildDeckMetadata(await toSavedDeck(record));
}

export default async function PublicDeckPage({ params }: Props) {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) notFound();

  const deck = await toSavedDeck(record);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PublicDeckDetail deck={deck} />
    </div>
  );
}
