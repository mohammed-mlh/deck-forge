import type { Metadata } from "next";
import { DeckDiscoveryView } from "@/components/public-decks/deck-discovery-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Decks" };

export default function DecksPage() {
  return (
    <Container>
      <DeckDiscoveryView />
    </Container>
  );
}
