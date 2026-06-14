import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { CardBrowser } from "@/components/cards-browser/card-browser";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cards",
  description: "Browse and search the complete Yu-Gi-Oh card database with advanced filters.",
  path: "/cards",
});

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string }>;
}) {
  const { archetype } = await searchParams;

  return (
    <Container className="flex h-[calc(100dvh-6.5rem)] max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden py-6">
      <PageHeader
        className="shrink-0 sr-only"
        title="Card Database"
        description="Browse, search, and filter Yu-Gi-Oh cards from the YGOProDeck database."
      />
      <CardBrowser className="min-h-0 flex-1" initialArchetype={archetype} />
    </Container>
  );
}
