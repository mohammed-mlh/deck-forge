import type { Metadata } from "next";
import { CardBrowser } from "@/components/cards-browser/card-browser";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cards",
  description: "Browse and search the complete Yu-Gi-Oh card database with advanced filters.",
  path: "/app/cards",
});

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ archetype?: string }>;
}) {
  const { archetype } = await searchParams;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
      <CardBrowser className="min-h-0 flex-1" initialArchetype={archetype} />
    </div>
  );
}
