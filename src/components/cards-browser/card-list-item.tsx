"use client";

import Image from "next/image";
import { getCardImageUrl, getCardTypeLabel } from "@/lib/cards";
import type { Card } from "@/features/cards/cards.schema";
import { cn } from "@/lib/utils";

interface CardListItemProps {
  card: Card;
  onClick?: (card: Card) => void;
  selected?: boolean;
}

export function CardListItem({ card, onClick, selected }: CardListItemProps) {
  const typeLabel = getCardTypeLabel(card);
  const hasStats = card.atk !== undefined || card.def !== undefined;

  return (
    <button
      type="button"
      onClick={() => onClick?.(card)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-(--color-border) bg-(--color-surface-1)/60 px-3 py-2 text-left transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)/80",
        selected && "border-(--color-primary) bg-(--color-primary-muted)"
      )}
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm">
        <Image
          src={getCardImageUrl(card, "small")}
          alt={card.name}
          fill
          sizes="40px"
          className="object-contain"
          unoptimized
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-(--color-foreground)">{card.name}</p>
        <p className="truncate text-xs text-(--color-foreground-subtle)">
          {[typeLabel, card.attribute, card.archetype].filter(Boolean).join(" · ")}
        </p>
      </div>

      {hasStats && (
        <div className="hidden shrink-0 text-right text-xs tabular-nums text-(--color-foreground-muted) sm:block">
          {card.atk !== undefined && (
            <span>
              ATK {card.atk === -1 ? "?" : card.atk}
            </span>
          )}
          {card.atk !== undefined && card.def !== undefined && (
            <span className="mx-1 text-(--color-foreground-subtle)">/</span>
          )}
          {card.def !== undefined && (
            <span>
              DEF {card.def === -1 ? "?" : card.def}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
