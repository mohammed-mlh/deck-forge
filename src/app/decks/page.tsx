import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PublicDeckCard } from "@/components/decks/deck-cards";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDecks } from "@/features/decks/decks.service";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Discover public Yu-Gi-Oh decks shared by the community.",
  path: "/decks",
});

export default async function DecksPage() {
  const records = await getPublicDecks();
  const decks = records.map(deckRecordToSavedDeck);

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Decks"
          description="Browse public decks shared by the community."
        />

        {decks.length === 0 ? (
          <EmptyState
            title="No public decks yet"
            description="When builders publish decks, they will appear here."
            className="py-24"
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {decks.map((deck) => (
                <PublicDeckCard key={deck.id} deck={deck} />
              ))}
            </div>

            <p className="flex items-center justify-center gap-2 text-xs text-(--color-foreground-subtle)">
              <Compass className="size-3.5" />
              {decks.length} public decks available
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
