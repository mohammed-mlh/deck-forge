import type { Metadata } from "next";
import { Suspense } from "react";
import { DeckBuilder } from "@/components/deck-builder/deck-builder";
import { DeckBuilderSkeleton } from "@/components/ui/loading-skeleton";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Deck Builder",
  description: "Build Yu-Gi-Oh decks with drag-and-drop zones, card search, and import/export.",
  path: "/app/deck-builder",
  noIndex: true,
});

export default function DeckBuilderPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense fallback={<DeckBuilderSkeleton className="min-h-0 flex-1" />}>
        <DeckBuilder />
      </Suspense>
    </div>
  );
}
