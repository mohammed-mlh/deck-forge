import type { Metadata } from "next";
import { MyDecksView } from "@/components/my-decks/my-decks-view";

export const metadata: Metadata = { title: "My Decks" };

export default function MyDecksPage() {
  return (
    <div className="min-h-full">
      <MyDecksView />
    </div>
  );
}
