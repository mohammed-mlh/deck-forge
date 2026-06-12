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

export default function CardsPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Card Database"
        description="Browse, search, and filter Yu-Gi-Oh cards from the YGOProDeck database."
      />
      <CardBrowser />
    </Container>
  );
}
