"use client";

import { CardListItem } from "@/components/cards-browser/card-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";
import type { YugiohCard } from "@/types/yugioh";

interface CardListProps {
  cards: YugiohCard[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onCardClick?: (card: YugiohCard) => void;
  selectedCardId?: number | null;
  emptyMessage?: string;
}

export function CardList({
  cards,
  isLoading,
  isError,
  errorMessage = "Failed to load cards. Try again.",
  onRetry,
  onCardClick,
  selectedCardId,
  emptyMessage = "No cards found. Try adjusting your search or filters.",
}: CardListProps) {
  if (isError) {
    return (
      <EmptyState
        icon={<Search className="size-5" />}
        title="Failed to load cards"
        description={errorMessage}
        className="py-16"
      >
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
          >
            Try again
          </button>
        )}
      </EmptyState>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<Search className="size-5" />}
        title="No cards found"
        description={emptyMessage}
        className="py-20"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <CardListItem
          key={card.id}
          card={card}
          onClick={onCardClick}
          selected={selectedCardId === card.id}
        />
      ))}
    </div>
  );
}
