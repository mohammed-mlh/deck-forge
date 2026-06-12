import type { Metadata } from "next";
import { Suspense } from "react";
import { DeckBuilder } from "@/components/deck-builder/deck-builder";
import { DeckBuilderSkeleton } from "@/components/ui/loading-skeleton";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Deck Builder",
  description: "Build Yu-Gi-Oh decks with drag-and-drop zones, card search, and import/export.",
  path: "/deck-builder",
  noIndex: true,
});

export default function DeckBuilderPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Suspense fallback={<DeckBuilderSkeleton />}>
        <DeckBuilder />
      </Suspense>
    </div>
  );
}
