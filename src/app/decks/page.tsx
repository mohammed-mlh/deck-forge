import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PublicDecksBrowser } from "@/components/decks/public-decks-browser";
import { getPublicDecks } from "@/features/public-decks/public-decks.service";
import { categorySlug, summarizeCategories, toListItem } from "@/features/public-decks/public-decks.view";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Browse public Yu-Gi-Oh decks by category.",
  path: "/decks",
});

function cardArtUrl(id: number): string {
  return `https://images.ygoprodeck.com/images/cards_cropped/${id}.jpg`;
}

export default async function DecksPage() {
  const decks = await getPublicDecks();
  const items = decks.map(toListItem);
  const categories = summarizeCategories(items);

  return (
    <Container className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-(--color-foreground)">Deck Library</h2>
        <p className="text-sm text-(--color-foreground-muted)">
          {items.length} public decks across {categories.length} categories.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No public decks yet"
          description="When builders publish decks, they will appear here."
          className="py-16"
        />
      ) : (
        <>
          <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/decks/${categorySlug(cat.name)}`}
                className="group relative flex h-28 w-56 shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong)"
              >
                {cat.coverCard > 0 && (
                  <Image
                    src={cardArtUrl(cat.coverCard)}
                    alt={cat.name}
                    fill
                    sizes="224px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative flex items-end justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-white/70">
                      {cat.count} {cat.count === 1 ? "deck" : "decks"}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <PublicDecksBrowser decks={items} />
        </>
      )}
    </Container>
  );
}
