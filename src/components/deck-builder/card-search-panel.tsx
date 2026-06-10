"use client";

import { useState } from "react";
import { SearchBar } from "@/components/cards-browser/search-bar";
import { FilterSidebar } from "@/components/cards-browser/filter-sidebar";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { CardSearchParams } from "@/types/yugioh";
import type { YugiohCard } from "@/types/yugioh";
import type { DeckZone } from "@/types/deck";
import { getDefaultZoneForCard } from "@/lib/deck-rules";

interface CardSearchPanelProps {
  onAddCard: (card: YugiohCard, zone?: DeckZone) => void;
}

export function CardSearchPanel({ onAddCard }: CardSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CardSearchParams>({ type: "all" });

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isFetching, isError, error, isBrowsing } =
    useBrowseCards(debouncedSearch, filters);

  const handleCardClick = (card: YugiohCard) => {
    onAddCard(card, getDefaultZoneForCard(card));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <SearchBar value={search} onChange={setSearch} />
      <FilterSidebar
        filters={filters}
        onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        compact
        className="shrink-0"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-foreground-subtle)]">
          {debouncedSearch
            ? `Results for "${debouncedSearch}"`
            : isBrowsing
              ? "Browse cards"
              : "Filtered results"}
        </p>
        {isFetching && !isLoading && (
          <p className="text-xs text-[var(--color-foreground-subtle)]">Updating…</p>
        )}
      </div>
      <div className="min-h-[200px] flex-1 overflow-y-auto pr-1">
        <CardGrid
          cards={cards}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          onCardClick={handleCardClick}
          draggable
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
