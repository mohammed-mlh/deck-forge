"use client";

import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Minus } from "lucide-react";
import { getCardImageUrl } from "@/lib/cards";
import { cn } from "@/lib/utils";
import type { DeckZone } from "@/features/decks/decks.schema";
import type { Card } from "@/features/cards/cards.schema";

interface DeckZoneCardProps {
  card: Card;
  zone: DeckZone;
  onSelect?: (card: Card) => void;
  onRemove: () => void;
  selected?: boolean;
  className?: string;
}

export function DeckZoneCard({
  card,
  zone,
  onSelect,
  onRemove,
  selected,
  className,
}: DeckZoneCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `deck-${zone}-${card.id}`,
    data: { type: "deck-card", card, zone, cardId: card.id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }}
      className={cn("group relative touch-none", className)}
      {...listeners}
      {...attributes}
    >
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
