import type { Metadata } from "next";
import { DeckBuilder } from "@/components/deck-builder/deck-builder";

export const metadata: Metadata = { title: "Deck Builder" };

export default function BuilderPage() {
  return (
    <div className="flex h-[calc(100dvh-3.5rem-3rem)] min-h-[600px] flex-col">
      <DeckBuilder />
    </div>
  );
}
