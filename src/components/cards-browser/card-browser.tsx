"use client";

import { useState } from "react";
import { SearchBar } from "@/components/cards-browser/search-bar";
import {
  CardFiltersPanel,
  DEFAULT_CARD_FILTERS,
} from "@/components/cards-browser/card-filters-panel";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { CardDetailPanel } from "@/components/cards-browser/card-detail-panel";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { CardFilters } from "@/lib/card-filters";
import type { YugiohCard } from "@/types/yugioh";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardBrowserProps {
  showFilters?: boolean;
  className?: string;
}

export function CardBrowser({ showFilters = true, className }: CardBrowserProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_CARD_FILTERS);
  const [selectedCard, setSelectedCard] = useState<YugiohCard | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isFetching, isError, error, isBrowsing } =
    useBrowseCards(debouncedSearch, filters);

  const updateFilters = (next: CardFilters) => setFilters(next);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={setSearch} className="flex-1" />
        {showFilters && (
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)] lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </button>
        )}
      </div>

      <div className="flex items-start gap-6">
        {showFilters && (
          <CardFiltersPanel
            filters={filters}
            onChange={updateFilters}
            className={cn(
              "hidden w-56 shrink-0 self-start rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 lg:flex",
              filtersOpen && "flex w-full lg:w-56"
            )}
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-[var(--color-foreground-subtle)]">
              {debouncedSearch
                ? `Results for "${debouncedSearch}"`
                : isBrowsing
                  ? "Browse cards"
                  : `${cards.length.toLocaleString()} filtered cards`}
            </p>
            {isFetching && !isLoading && (
              <p className="text-xs text-[var(--color-foreground-subtle)]">Updating…</p>
            )}
          </div>
          <CardGrid
            cards={cards}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            onCardClick={setSelectedCard}
          />
        </div>
      </div>

      {filtersOpen && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 lg:hidden">
          <CardFiltersPanel filters={filters} onChange={updateFilters} />
        </div>
      )}

      <CardDetailPanel card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
}
