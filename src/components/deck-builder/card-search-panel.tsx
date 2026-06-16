"use client";

import { forwardRef, useState } from "react";
import { SearchBar } from "@/components/cards-browser/search-bar";
import {
  CardFiltersPanel,
  DEFAULT_CARD_FILTERS,
} from "@/components/cards-browser/card-filters-panel";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { Card } from "@/features/cards/cards.schema";
import type { DeckZone } from "@/features/decks/decks.schema";
import { cn } from "@/lib/utils";
import { getDefaultZoneForCard } from "@/lib/deck-rules";

interface CardSearchPanelProps {
  onAddCard: (card: Card, zone?: DeckZone) => void;
  onSelectCard?: (card: Card) => void;
  selectedCardId?: number | null;
  className?: string;
  embedded?: boolean;
}

export const CardSearchPanel = forwardRef<HTMLInputElement, CardSearchPanelProps>(
  function CardSearchPanel(
    { onAddCard, onSelectCard, selectedCardId, className, embedded = false },
    searchRef
  ) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_CARD_FILTERS);

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isFetching, isError, refetch } =
    useBrowseCards(debouncedSearch, filters);

  const handleCardClick = (card: Card) => {
    onSelectCard?.(card);
  };

  const handleCardDoubleClick = (card: Card) => {
    onAddCard(card, getDefaultZoneForCard(card));
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        embedded ? "" : "border-l border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="flex h-52 shrink-0 flex-col border-b border-(--color-border)">
        <div className="shrink-0 p-3 pb-2">
          <SearchBar
            ref={searchRef}
            value={search}
            onChange={setSearch}
            placeholder="Search cards..."
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          <CardFiltersPanel
            filters={filters}
            onChange={setFilters}
            className="border-0 bg-transparent p-0"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <p className="shrink-0 border-b border-(--color-border) px-3 py-2 text-[11px] text-(--color-foreground-subtle)">
          {isLoading
            ? "Loading cards…"
            : `${cards.length} results — click to preview, drag or double-click to add`}
          {isFetching && !isLoading && " · updating…"}
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <CardGrid
            cards={cards}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to load cards. Try again."
            onRetry={() => void refetch()}
            onCardClick={handleCardClick}
            onCardDoubleClick={handleCardDoubleClick}
            selectedCardId={selectedCardId}
            draggable
            columns={4}
            emptyMessage={
              debouncedSearch
                ? `No cards found for "${debouncedSearch}".`
                : "No cards match the current filters."
            }
          />
        </div>
      </div>
    </div>
  );
  }
);
