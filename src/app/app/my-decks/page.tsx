import type { Metadata } from "next";
import { MyDecksContent } from "@/app/my-decks/content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "My Decks",
  description: "View and manage your saved Yu-Gi-Oh decks.",
  path: "/app/my-decks",
  noIndex: true,
});

export default function MyDecksPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <MyDecksContent />
    </div>
  );
}
