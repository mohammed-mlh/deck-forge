"use client";

import { CardItem } from "@/components/cards-browser/card-item";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";
import type { YugiohCard } from "@/types/yugioh";

const GRID_COLS: Record<3 | 6, string> = {
  3: "grid-cols-3 gap-2",
  6: "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

interface CardGridProps {
  cards: YugiohCard[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onCardClick?: (card: YugiohCard) => void;
  onCardDoubleClick?: (card: YugiohCard) => void;
  selectedCardId?: number | null;
  draggable?: boolean;
  emptyMessage?: string;
  columns?: 3 | 6;
}

export function CardGrid({
  cards,
  isLoading,
  isError,
  errorMessage = "Failed to load cards. Please try again.",
  onCardClick,
  onCardDoubleClick,
  selectedCardId,
  draggable,
  emptyMessage = "No cards found. Try adjusting your search or filters.",
  columns = 6,
}: CardGridProps) {
  const gridClass = GRID_COLS[columns];
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
      <div className={`grid ${gridClass}`}>
        {Array.from({ length: columns === 3 ? 9 : 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[59/86] w-full rounded-sm"
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
    <div className={`grid ${gridClass}`}>
      {cards.map((card, index) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={onCardClick}
          onDoubleClick={onCardDoubleClick}
          selected={selectedCardId === card.id}
          draggable={draggable}
          dragId={`search-${card.id}`}
          priority={index < columns * 2}
        />
      ))}
    </div>
  );
}
