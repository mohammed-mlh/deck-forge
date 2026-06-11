import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseDeckDetail } from "@/components/browse-decks/browse-deck-detail";
import { getPrebuiltDeck } from "@/lib/prebuilt-decks";

interface BrowseDeckPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BrowseDeckPageProps): Promise<Metadata> {
  const { id } = await params;
  const deck = getPrebuiltDeck(id);
  return { title: deck?.name ?? "Deck" };
}

export default async function BrowseDeckPage({ params }: BrowseDeckPageProps) {
  const { id } = await params;
  const deck = getPrebuiltDeck(id);

  if (!deck) notFound();

  return (
    <div className="min-h-full">
      <BrowseDeckDetail deck={deck} />
    </div>
  );
}
