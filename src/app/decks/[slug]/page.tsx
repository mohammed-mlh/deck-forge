import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDeckView } from "@/components/public-decks/public-deck-view";
import { Container } from "@/components/layout/container";
import { buildPublicDeckMetadata } from "@/lib/decks/deck-metadata";
import { getPublicDeckBySlug } from "@/lib/decks/public-decks";

interface PublicDeckPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicDeckPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getPublicDeckBySlug(slug);
  if (!deck) return { title: "Deck" };
  return buildPublicDeckMetadata(deck);
}

export default async function PublicDeckPage({ params }: PublicDeckPageProps) {
  const { slug } = await params;
  const deck = getPublicDeckBySlug(slug);

  if (!deck) notFound();

  return (
    <Container>
      <PublicDeckView deck={deck} />
    </Container>
  );
}
