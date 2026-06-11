"use client";

import { useState } from "react";
import { SearchBar } from "@/components/cards-browser/search-bar";
import { BuilderCardFilters } from "@/components/deck-builder/builder-card-filters";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { CardSearchParams } from "@/types/yugioh";
import type { YugiohCard } from "@/types/yugioh";
import type { DeckZone } from "@/types/deck";
import { cn } from "@/lib/utils";
import { getDefaultZoneForCard } from "@/lib/deck-rules";

interface CardSearchPanelProps {
  onAddCard: (card: YugiohCard, zone?: DeckZone) => void;
  className?: string;
}

export function CardSearchPanel({ onAddCard, className }: CardSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CardSearchParams>({ type: "all" });

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isFetching, isError, error } =
    useBrowseCards(debouncedSearch, filters);

  const handleCardClick = (card: YugiohCard) => {
    onAddCard(card, getDefaultZoneForCard(card));
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-surface)]",
        className
      )}
    >
      <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--color-border)] p-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search cards..."
        />
        <BuilderCardFilters
          filters={filters}
          onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        />
        <p className="shrink-0 text-[11px] text-[var(--color-foreground-subtle)]">
          {isLoading
            ? "Loading cards…"
            : `${cards.length} results — drag a card into a deck section`}
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
          draggable
          columns={3}
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
