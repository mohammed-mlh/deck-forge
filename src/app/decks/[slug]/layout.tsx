import type { Metadata } from "next";
import { buildPublicDeckMetadata } from "@/lib/decks/deck-metadata";
import { getPublicDeckBySlug } from "@/lib/decks/public-decks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deck = getPublicDeckBySlug(slug);
  if (!deck) return { title: "Deck" };
  return buildPublicDeckMetadata(deck);
}

export default function PublicDeckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
