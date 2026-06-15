"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useHydratedDeckOrEmpty } from "@/hooks/use-hydrated-deck";
import { usePageView } from "@/hooks/use-page-view";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { track } from "@/lib/analytics";
import { deckToCreateInput } from "@/features/decks/decks.mapper";
import { getFeaturedCard, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import type { DeckCardEntry, DeckZone, SavedDeck } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import { cn } from "@/lib/utils";

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

export function PublicDeckDetail({ deck: initialDeck }: { deck: SavedDeck }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { fork } = useSavedDecks();
  const { deck: hydratedDeck } = useHydratedDeckOrEmpty(initialDeck);
  const deck = hydratedDeck ?? initialDeck;
  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const featured = getFeaturedCard(deck);
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);

  usePageView("page_view_deck", {
    deckId: deck.id,
    deckName: deck.name,
  });

  const handleCopyDeck = async () => {
    setCopyError(null);

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setCopying(true);
    track("deck_copied", {
      sourceDeckId: deck.id,
      deckName: deck.name,
    });
    try {
      const saved = await fork(deckToCreateInput(deck));
      router.push(`/app/deck-builder/${saved.id}`);
    } catch (err) {
      setCopying(false);
      const status =
        err && typeof err === "object" && "status" in err
          ? (err as { status: number }).status
          : undefined;
      if (status === 401) {
        openSignIn();
        return;
      }
      setCopyError(err instanceof Error ? err.message : "Failed to copy deck");
    }
  };

  const handleShare = async () => {
    track("deck_shared", {
      deckId: deck.id,
      deckName: deck.name,
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
          href="/app/decks"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
        >
          <ArrowLeft className="size-4" />
          Back to Decks
        </Link>

        <div className="relative flex overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)">
          <div className="relative z-10 min-w-0 flex-1 p-5">
            <h1 className="text-2xl font-semibold text-(--color-foreground)">{deck.name}</h1>
            <p className="mt-3 text-sm tabular-nums text-(--color-foreground-subtle)">
              Main: {main} · Extra: {extra} · Side: {side}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleCopyDeck()}
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
            {copyError && (
              <p className="mt-2 text-sm text-(--color-danger)">{copyError}</p>
            )}
          </div>

          {featured && (
            <div className="relative w-[44%] shrink-0 self-stretch sm:w-[40%]">
              <Image
                src={getCardArtUrl(featured)}
                alt={featured.name}
                fill
                sizes="(max-width: 640px) 44vw, 320px"
                className="object-cover object-[center_20%]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-(--color-surface-1) via-(--color-surface-1)/70 to-transparent" />
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
