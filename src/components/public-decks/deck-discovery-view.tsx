"use client";

import { Compass } from "lucide-react";
import { PublicDeckCard } from "@/components/public-decks/public-deck-card";
import { PageHeader } from "@/components/layout/page-header";
import { getPublicDecks } from "@/lib/decks/public-decks";

export function DeckDiscoveryView() {
  const decks = getPublicDecks();

  return (
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
  );
}
