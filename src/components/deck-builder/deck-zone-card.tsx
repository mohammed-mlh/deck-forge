"use client";

import Image from "next/image";
import { Minus } from "lucide-react";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import { cn } from "@/lib/utils";
import type { DeckCardEntry } from "@/types/deck";

interface DeckZoneCardProps {
  entry: DeckCardEntry;
  onRemove: () => void;
  className?: string;
}

export function DeckZoneCard({ entry, onRemove, className }: DeckZoneCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <button
        type="button"
        onClick={onRemove}
        className="relative block w-full overflow-hidden rounded-[var(--radius-sm)] transition-transform hover:scale-[1.03]"
        aria-label={`Remove ${entry.card.name}`}
      >
        <div className="relative aspect-[59/86] w-full">
          <Image
            src={getCardImageUrl(entry.card, "small")}
            alt={entry.card.name}
            fill
            sizes="80px"
            className="object-contain"
            unoptimized
          />
        </div>
        {entry.quantity > 1 && (
          <span className="absolute left-0.5 top-0.5 rounded bg-[var(--color-danger)] px-1 py-px text-[9px] font-bold leading-none text-white">
            {entry.quantity}x
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 hidden size-4 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-foreground)] shadow-sm transition-colors group-hover:flex hover:bg-[var(--color-danger)] hover:text-white"
        aria-label={`Remove one ${entry.card.name}`}
      >
        <Minus className="size-2.5" />
      </button>
    </div>
  );
}
