import type { Metadata } from "next";
import { MyDecksContent } from "@/app/my-decks/content";
import { Container } from "@/components/layout/container";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "My Decks",
  description: "View and manage your saved Yu-Gi-Oh decks.",
  path: "/my-decks",
  noIndex: true,
});

export default function MyDecksPage() {
  return (
    <Container>
      <MyDecksContent />
    </Container>
  );
}
