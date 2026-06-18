import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicDecks } from "@/features/public-decks/public-decks.service";
import { summarizeCategories, toListItem } from "@/features/public-decks/public-decks.view";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Decks",
  description: "Browse public Yu-Gi-Oh decks by category.",
  path: "/app/decks",
});

function cardArtUrl(id: number): string {
  return `https://images.ygoprodeck.com/images/cards_cropped/${id}.jpg`;
}

export default async function DecksPage() {
  const decks = await getPublicDecks();
  const items = decks.map(toListItem);
  const categories = summarizeCategories(items);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6">
      <Container className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-(--color-foreground)">Deck Library</h2>
          <p className="text-sm text-(--color-foreground-muted)">
            {decks.length} public decks across {categories.length} categories.
          </p>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            title="No public decks yet"
            description="When builders publish decks, they will appear here."
            className="py-16"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/app/decks/${category.slug}`}
                className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong)"
              >
                {category.coverCard > 0 && (
                  <Image
                    src={cardArtUrl(category.coverCard)}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-(--color-surface-1) via-(--color-surface-1)/60 to-transparent" />
                <div className="relative flex items-end justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-(--color-foreground)">
                      {category.name}
                    </h3>
                    <p className="text-xs text-(--color-foreground-muted)">
                      {category.count} {category.count === 1 ? "deck" : "decks"}
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-(--color-foreground-subtle) transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
