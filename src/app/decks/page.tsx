import type { Metadata } from "next";
import { DeckDiscoveryView } from "@/components/public-decks/deck-discovery-view";
import { Container } from "@/components/layout/container";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Discover official Yu-Gi-Oh starter decks and copy them into your builder.",
  path: "/decks",
});

export default function DecksPage() {
  return (
    <Container>
      <DeckDiscoveryView />
    </Container>
  );
}
