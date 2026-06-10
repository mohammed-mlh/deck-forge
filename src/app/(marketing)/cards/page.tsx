import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { CardBrowser } from "@/components/cards-browser/card-browser";

export const metadata: Metadata = {
  title: "Cards",
  description: "Browse the complete Yu-Gi-Oh card database.",
};

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
