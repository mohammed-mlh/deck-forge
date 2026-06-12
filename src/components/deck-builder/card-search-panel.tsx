"use client";

import { useState } from "react";
import { SearchBar } from "@/components/cards-browser/search-bar";
import {
  CardFiltersPanel,
  DEFAULT_CARD_FILTERS,
} from "@/components/cards-browser/card-filters-panel";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { YugiohCard } from "@/types/yugioh";
import type { DeckZone } from "@/types/deck";
import { cn } from "@/lib/utils";
import { getDefaultZoneForCard } from "@/lib/deck-rules";

interface CardSearchPanelProps {
  onAddCard: (card: YugiohCard, zone?: DeckZone) => void;
  onSelectCard?: (card: YugiohCard) => void;
  selectedCardId?: number | null;
  className?: string;
}

export function CardSearchPanel({
  onAddCard,
  onSelectCard,
  selectedCardId,
  className,
}: CardSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_CARD_FILTERS);

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isFetching, isError, error } =
    useBrowseCards(debouncedSearch, filters);

  const handleCardClick = (card: YugiohCard) => {
    onSelectCard?.(card);
  };

  const handleCardDoubleClick = (card: YugiohCard) => {
    onAddCard(card, getDefaultZoneForCard(card));
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border-l border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="flex max-h-[45%] shrink-0 flex-col gap-2 overflow-y-auto border-b border-(--color-border) p-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search cards..."
        />
        <CardFiltersPanel
          filters={filters}
          onChange={setFilters}
          className="border-0 bg-transparent p-0"
        />
        <p className="shrink-0 text-[11px] text-(--color-foreground-subtle)">
          {isLoading
            ? "Loading cards…"
            : `${cards.length} results — click to preview, drag or double-click to add`}
          {isFetching && !isLoading && " · updating…"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <CardGrid
          cards={cards}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          onCardClick={handleCardClick}
          onCardDoubleClick={handleCardDoubleClick}
          selectedCardId={selectedCardId}
          draggable
          columns={4}
          emptyMessage={
            debouncedSearch
              ? `No cards found for "${debouncedSearch}".`
              : "No cards available. Try again shortly."
          }
        />
      </div>
    </div>
  );
}
