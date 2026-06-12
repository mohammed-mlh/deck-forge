import type { Metadata } from "next";
import { MyDecksView } from "@/components/my-decks/my-decks-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "My Decks" };

export default function MyDecksPage() {
  return (
    <Container>
      <MyDecksView />
    </Container>
  );
}
