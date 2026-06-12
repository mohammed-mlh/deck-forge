"use client";

import Image from "next/image";
import { Minus } from "lucide-react";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import { cn } from "@/lib/utils";
import type { YugiohCard } from "@/types/yugioh";

interface DeckZoneCardProps {
  card: YugiohCard;
  onSelect?: (card: YugiohCard) => void;
  onRemove: () => void;
  selected?: boolean;
  className?: string;
}

export function DeckZoneCard({
  card,
  onSelect,
  onRemove,
  selected,
  className,
}: DeckZoneCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <button
        type="button"
        onClick={() => onSelect?.(card)}
        className={cn(
          "relative block w-full overflow-hidden rounded-[2px] transition-transform hover:scale-[1.02]",
          selected && "ring-2 ring-(--color-primary)"
        )}
        aria-label={`View ${card.name}`}
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
        className="absolute -right-0.5 -top-0.5 hidden size-3.5 items-center justify-center rounded-full bg-(--color-surface-3) text-(--color-foreground) shadow-sm transition-colors group-hover:flex hover:bg-(--color-danger) hover:text-white"
        aria-label={`Remove ${card.name}`}
      >
        <Minus className="size-2" />
      </button>
    </div>
  );
}
