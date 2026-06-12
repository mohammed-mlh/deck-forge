"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, User } from "lucide-react";
import { PublicDeckZone } from "@/components/public-decks/public-deck-zone";
import { clonePublicDeckToSaved } from "@/lib/decks/deck-utils";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import type { PublicDeck } from "@/types/public-deck";
import { cn } from "@/lib/utils";

interface PublicDeckViewProps {
  deck: PublicDeck;
}

const DIFFICULTY_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export function PublicDeckView({ deck }: PublicDeckViewProps) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const featured = getMostPowerfulMonster(deck);
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);

  const handleCopyDeck = () => {
    setCopying(true);
    const saved = clonePublicDeckToSaved(deck);
    router.push(`/deck-builder/${saved.id}`);
  };

  return (
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
            <button
              type="button"
              onClick={handleCopyDeck}
              disabled={copying}
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)",
                copying && "opacity-70"
              )}
            >
              <Copy className="size-4" />
              {copying ? "Opening…" : "Copy Deck"}
            </button>
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
        <PublicDeckZone zone="main" entries={deck.main} />
        <PublicDeckZone zone="extra" entries={deck.extra} />
        <PublicDeckZone zone="side" entries={deck.side} />
      </div>
    </div>
  );
}
