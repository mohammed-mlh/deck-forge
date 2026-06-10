"use client";

import { CardItem } from "@/components/cards-browser/card-item";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";
import type { YugiohCard } from "@/types/yugioh";

interface CardGridProps {
  cards: YugiohCard[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onCardClick?: (card: YugiohCard) => void;
  draggable?: boolean;
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  isLoading,
  isError,
  errorMessage = "Failed to load cards. Please try again.",
  onCardClick,
  draggable,
  emptyMessage = "No cards found. Try adjusting your search or filters.",
}: CardGridProps) {
  if (isError) {
    return (
      <EmptyState
        icon={<Search className="size-5" />}
        title="Search failed"
        description={errorMessage}
        className="py-16"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[59/86] w-full rounded-[var(--radius-sm)]"
          />
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={onCardClick}
          draggable={draggable}
          dragId={`search-${card.id}`}
        />
      ))}
    </div>
  );
}
