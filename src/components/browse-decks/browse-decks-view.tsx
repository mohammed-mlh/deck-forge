"use client";

import { Compass } from "lucide-react";
import { BrowseDeckCard } from "@/components/browse-decks/browse-deck-card";
import { PageHeader } from "@/components/layout/page-header";
import { getPrebuiltDecks } from "@/lib/prebuilt-decks";

export function BrowseDecksView() {
  const decks = getPrebuiltDecks();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Browse Decks"
        description="Explore community-built decks for inspiration before you craft your own."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {decks.map((deck) => (
          <BrowseDeckCard key={deck.id} deck={deck} />
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-(--color-foreground-subtle)">
        <Compass className="size-3.5" />
        {decks.length} public decks available
      </p>
    </div>
  );
}
