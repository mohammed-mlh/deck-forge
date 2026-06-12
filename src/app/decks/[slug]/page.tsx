"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Share2, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import { usePageView } from "@/hooks/use-page-view";
import { track } from "@/lib/analytics";
import { clonePublicDeckToSaved } from "@/lib/decks/deck-utils";
import { getPublicDeckBySlug } from "@/lib/decks/public-decks";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import type { DeckCardEntry, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import type { PublicDeck } from "@/types/public-deck";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const ZONE_LABELS: Record<DeckZone, string> = {
  main: "Main Deck",
  extra: "Extra Deck",
  side: "Side Deck",
};

function DeckZoneSection({ zone, entries }: { zone: DeckZone; entries: DeckCardEntry[] }) {
  const count = countZone(entries);
  const capacity = DECK_LIMITS[zone].max;

  return (
    <section className="overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)">
      <div className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface-2) px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-(--color-foreground)">
          {ZONE_LABELS[zone]}
        </h3>
        <span className="text-[10px] tabular-nums text-(--color-foreground-subtle)">
          {count}/{capacity}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 p-3">
        {entries.flatMap((entry, entryIndex) =>
          Array.from({ length: entry.quantity }, (_, copy) => (
            <div
              key={`${entryIndex}-${entry.card.id}-${copy}`}
              className="relative w-[52px] shrink-0 overflow-hidden rounded-[2px] sm:w-[60px]"
              title={entry.card.name}
            >
              <div className="relative aspect-[59/86] w-full">
                <Image
                  src={getCardImageUrl(entry.card, "small")}
                  alt={entry.card.name}
                  fill
                  sizes="60px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function PublicDeckPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const deck = getPublicDeckBySlug(slug);

  if (!deck) notFound();

  return <PublicDeckContent deck={deck} />;
}

function PublicDeckContent({ deck }: { deck: PublicDeck }) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const featured = getMostPowerfulMonster(deck);
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);

  usePageView("page_view_deck", {
    deckId: deck.id,
    slug: deck.slug,
    deckName: deck.name,
    source: deck.source,
  });

  const handleCopyDeck = () => {
    setCopying(true);
    track("deck_copied", {
      sourceDeckId: deck.id,
      slug: deck.slug,
      deckName: deck.name,
      source: deck.source,
    });
    const saved = clonePublicDeckToSaved(deck);
    router.push(`/deck-builder/${saved.id}`);
  };

  const handleShare = async () => {
    track("deck_shared", {
      deckId: deck.id,
      slug: deck.slug,
      deckName: deck.name,
      source: deck.source,
    });
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: deck.name, url });
      } catch {
        // user cancelled share sheet
      }
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <Container>
      <div className="flex flex-col gap-6">
        <Link
          href="/decks"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
        >
          <ArrowLeft className="size-4" />
          Back to Decks
        </Link>

        <div className="relative overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative z-10 min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-block rounded bg-(--color-primary-muted) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-primary)">
                  {deck.archetype}
                </span>
                {deck.difficulty && (
                  <span className="inline-block rounded bg-(--color-surface-3) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-foreground-muted)">
                    {DIFFICULTY_LABELS[deck.difficulty]}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-(--color-foreground)">{deck.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-(--color-foreground-muted)">
                <User className="size-3.5" />
                by {deck.author?.name ?? "Unknown"}
              </p>
              <p className="mt-3 max-w-xl text-sm text-(--color-foreground-muted)">
                {deck.description}
              </p>
              {deck.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {deck.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-(--color-surface-2) px-2 py-0.5 text-[10px] text-(--color-foreground-subtle)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm tabular-nums text-(--color-foreground-subtle)">
                Main: {main} · Extra: {extra} · Side: {side}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyDeck}
                  disabled={copying}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)",
                    copying && "opacity-70"
                  )}
                >
                  <Copy className="size-4" />
                  {copying ? "Opening…" : "Copy Deck"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="inline-flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
              </div>
            </div>

            {featured && (
              <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-md border border-(--color-border) sm:h-44 sm:w-32">
                <Image
                  src={getCardArtUrl(featured)}
                  alt={featured.name}
                  fill
                  sizes="128px"
                  className="object-cover object-[center_15%]"
                  unoptimized
                />
              </div>
            )}
          </div>

          {featured && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
              <Image
                src={getCardArtUrl(featured)}
                alt=""
                fill
                className="object-cover object-[center_20%] blur-2xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-(--color-surface-1) via-(--color-surface-1)/80 to-(--color-surface-1)/40" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <DeckZoneSection zone="main" entries={deck.main} />
          <DeckZoneSection zone="extra" entries={deck.extra} />
          <DeckZoneSection zone="side" entries={deck.side} />
        </div>
      </div>
    </Container>
  );
}
