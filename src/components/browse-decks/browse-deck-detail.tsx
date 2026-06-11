"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { BrowseDeckZone } from "@/components/browse-decks/browse-deck-zone";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import type { PrebuiltDeck } from "@/types/prebuilt-deck";

interface BrowseDeckDetailProps {
  deck: PrebuiltDeck;
}

export function BrowseDeckDetail({ deck }: BrowseDeckDetailProps) {
  const featured = getMostPowerfulMonster(deck);
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Link
        href="/browse-decks"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="size-4" />
        Back to Browse
      </Link>

      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative z-10 min-w-0">
            <span className="mb-2 inline-block rounded bg-[var(--color-primary-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              {deck.archetype}
            </span>
            <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">{deck.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-foreground-muted)]">
              <User className="size-3.5" />
              by {deck.author}
            </p>
            <p className="mt-3 max-w-xl text-sm text-[var(--color-foreground-muted)]">
              {deck.description}
            </p>
            <p className="mt-3 text-sm tabular-nums text-[var(--color-foreground-subtle)]">
              Main: {main} · Extra: {extra} · Side: {side}
            </p>
          </div>

          {featured && (
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] sm:h-44 sm:w-32">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-1)] via-[var(--color-surface-1)]/80 to-[var(--color-surface-1)]/40" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <BrowseDeckZone zone="main" entries={deck.main} />
        <BrowseDeckZone zone="extra" entries={deck.extra} />
        <BrowseDeckZone zone="side" entries={deck.side} />
      </div>
    </div>
  );
}
