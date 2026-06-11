import type { Metadata } from "next";
import { BrowseDecksView } from "@/components/browse-decks/browse-decks-view";

export const metadata: Metadata = { title: "Browse Decks" };

export default function BrowseDecksPage() {
  return (
    <div className="min-h-full">
      <BrowseDecksView />
    </div>
  );
}
