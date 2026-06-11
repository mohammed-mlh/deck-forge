"use client";

import Image from "next/image";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import { countZone } from "@/lib/deck-rules";
import type { DeckCardEntry, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";

const ZONE_LABELS: Record<DeckZone, string> = {
  main: "Main Deck",
  extra: "Extra Deck",
  side: "Side Deck",
};

interface BrowseDeckZoneProps {
  zone: DeckZone;
  entries: DeckCardEntry[];
}

export function BrowseDeckZone({ zone, entries }: BrowseDeckZoneProps) {
  const count = countZone(entries);
  const capacity = DECK_LIMITS[zone].max;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-foreground)]">
          {ZONE_LABELS[zone]}
        </h3>
        <span className="text-[10px] tabular-nums text-[var(--color-foreground-subtle)]">
          {count}/{capacity}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 p-3">
        {entries.flatMap((entry) =>
          Array.from({ length: entry.quantity }, (_, copy) => (
            <div
              key={`${entry.card.id}-${copy}`}
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
