import type { Metadata } from "next";
import { Suspense } from "react";
import { DeckBuilder } from "@/components/deck-builder/deck-builder";

export const metadata: Metadata = { title: "Deck Builder" };

export default function BuilderPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Suspense>
        <DeckBuilder />
      </Suspense>
    </div>
  );
}
