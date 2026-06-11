"use client";

import Image from "next/image";
import { Minus } from "lucide-react";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import { cn } from "@/lib/utils";
import type { YugiohCard } from "@/types/yugioh";

interface DeckZoneCardProps {
  card: YugiohCard;
  onRemove: () => void;
  className?: string;
}

export function DeckZoneCard({ card, onRemove, className }: DeckZoneCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <button
        type="button"
        onClick={onRemove}
        className="relative block w-full overflow-hidden rounded-[2px] transition-transform hover:scale-[1.02]"
        aria-label={`Remove ${card.name}`}
      >
        <div className="relative aspect-[59/86] w-full">
          <Image
            src={getCardImageUrl(card, "small")}
            alt={card.name}
            fill
            sizes="(max-width: 1280px) 8vw, 72px"
            className="object-contain"
            unoptimized
          />
        </div>
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-0.5 -top-0.5 hidden size-3.5 items-center justify-center rounded-full bg-[var(--color-surface-3)] text-[var(--color-foreground)] shadow-sm transition-colors group-hover:flex hover:bg-[var(--color-danger)] hover:text-white"
        aria-label={`Remove ${card.name}`}
      >
        <Minus className="size-2" />
      </button>
    </div>
  );
}
