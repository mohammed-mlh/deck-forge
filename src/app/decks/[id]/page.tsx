import { notFound } from "next/navigation";
import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDeckById } from "@/features/decks/decks.service";
import { PublicDeckDetail } from "@/app/decks/[id]/content";

export default async function PublicDeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getPublicDeckById(id);
  if (!record) notFound();

  return <PublicDeckDetail deck={deckRecordToSavedDeck(record)} />;
}
