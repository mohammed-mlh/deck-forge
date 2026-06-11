"use client";

import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";

interface CardItemProps {
  card: YugiohCard;
  onClick?: (card: YugiohCard) => void;
  onDoubleClick?: (card: YugiohCard) => void;
  selected?: boolean;
  draggable?: boolean;
  dragId?: string;
  className?: string;
}

export function CardItem({
  card,
  onClick,
  onDoubleClick,
  selected,
  draggable = false,
  dragId,
  className,
}: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId ?? `card-${card.id}`,
    data: { card, type: "search-card" },
    disabled: !draggable,
  });

  const style = draggable
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <button
      ref={draggable ? setNodeRef : undefined}
      type="button"
      style={style}
      {...(draggable ? { ...listeners, ...attributes } : {})}
      onClick={() => onClick?.(card)}
      onDoubleClick={() => onDoubleClick?.(card)}
      className={cn(
        "group text-left",
        isDragging && "z-50",
        draggable && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[59/86] w-full overflow-hidden rounded-[var(--radius-sm)] transition-transform duration-200 group-hover:scale-[1.02]",
          selected && "ring-2 ring-[var(--color-primary)]"
        )}
      >
        <Image
          src={getCardImageUrl(card, "small")}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 150px"
          className="object-contain"
          unoptimized
        />
      </div>
    </button>
  );
}
