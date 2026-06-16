import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PublicDeckCard } from "@/components/decks/deck-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { deckRecordsToSavedDecks } from "@/features/decks/decks.mapper";
import { getPublicDecks } from "@/features/decks/decks.service";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Discover public Yu-Gi-Oh decks shared by the community.",
  path: "/app/decks",
});

export default async function DecksPage() {
  const records = await getPublicDecks();
  const decks = await deckRecordsToSavedDecks(records);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-(--color-foreground)">Deck Library</h2>
          <p className="text-sm text-(--color-foreground-muted)">
            Browse public decks shared by the community.
          </p>
        </div>

        {decks.length === 0 ? (
          <EmptyState
            title="No public decks yet"
            description="When builders publish decks, they will appear here."
            className="py-16"
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {decks.map((deck) => (
                <PublicDeckCard key={deck.id} deck={deck} />
              ))}
            </div>

            <p className="flex items-center justify-center gap-2 pb-4 text-xs text-(--color-foreground-subtle)">
              <Compass className="size-3.5" />
              {decks.length} public decks available
            </p>
          </>
        )}
      </div>
    </div>
  );
}
