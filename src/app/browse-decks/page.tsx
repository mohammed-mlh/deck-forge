import type { Metadata } from "next";
import { BrowseDecksView } from "@/components/browse-decks/browse-decks-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Browse Decks" };

export default function BrowseDecksPage() {
  return (
    <Container>
      <BrowseDecksView />
    </Container>
  );
}
