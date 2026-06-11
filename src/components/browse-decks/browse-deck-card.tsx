"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, User } from "lucide-react";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone } from "@/lib/deck-rules";
import type { PrebuiltDeck } from "@/types/prebuilt-deck";
import { cn } from "@/lib/utils";

interface BrowseDeckCardProps {
  deck: PrebuiltDeck;
}

export function BrowseDeckCard({ deck }: BrowseDeckCardProps) {
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const featured = getMostPowerfulMonster(deck);

  return (
    <Link
      href={`/browse-decks/${deck.id}`}
      className="group relative flex h-[168px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-4 pr-2">
        <div className="min-w-0">
          <span className="mb-1 inline-block rounded bg-[var(--color-primary-muted)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            {deck.archetype}
          </span>
          <h3 className="truncate text-lg font-semibold text-[var(--color-foreground)]">
            {deck.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-foreground-subtle)]">
            <User className="size-3" />
            {deck.author}
          </p>
          <p className="mt-2 text-sm tabular-nums text-[var(--color-foreground-muted)]">
            Main: {main} Extra: {extra} Side: {side}
          </p>
        </div>
      </div>

      <div className="relative h-full w-[44%] shrink-0 sm:w-[40%]">
        {featured ? (
          <>
            <Image
              src={getCardArtUrl(featured)}
              alt={featured.name}
              fill
              sizes="(max-width: 640px) 44vw, 280px"
              className="object-cover object-[center_20%]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-1)] via-[var(--color-surface-1)]/70 to-transparent transition-colors group-hover:from-[var(--color-surface-2)] group-hover:via-[var(--color-surface-2)]/70" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--color-bg-elevated)]">
            <Layers className="size-8 text-[var(--color-foreground-disabled)]" />
          </div>
        )}

        <span
          className={cn(
            "absolute right-3 top-3 rounded bg-[var(--color-success)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-success)]"
          )}
        >
          Public
        </span>
      </div>
    </Link>
  );
}
