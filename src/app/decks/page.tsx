import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PublicDeckCard } from "@/components/decks/deck-cards";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getPublicDecks } from "@/lib/decks/public-decks";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Discover official Yu-Gi-Oh starter decks and copy them into your builder.",
  path: "/decks",
});

export default function DecksPage() {
  const decks = getPublicDecks();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Decks"
          description="Discover official and community decks for inspiration before you craft your own."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {decks.map((deck) => (
            <PublicDeckCard key={deck.id} deck={deck} />
          ))}
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-(--color-foreground-subtle)">
          <Compass className="size-3.5" />
          {decks.length} public decks available
        </p>
      </div>
    </Container>
  );
}
