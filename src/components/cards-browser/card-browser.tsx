"use client";

import { useCallback, useState } from "react";
import { track } from "@/lib/analytics";
import { usePageView } from "@/hooks/use-page-view";
import { SearchBar } from "@/components/cards-browser/search-bar";
import {
  CardFiltersPanel,
  DEFAULT_CARD_FILTERS,
} from "@/components/cards-browser/card-filters-panel";
import { CardGrid } from "@/components/cards-browser/card-grid";
import { CardList } from "@/components/cards-browser/card-list";
import { CardDetailPanel } from "@/components/cards-browser/card-detail-panel";
import { useDebounce } from "@/hooks/use-debounce";
import { useBrowseCards } from "@/hooks/use-browse-cards";
import type { CardFilters } from "@/lib/card-filters";
import type { Card } from "@/features/cards/cards.schema";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface CardBrowserProps {
  showFilters?: boolean;
  className?: string;
  initialArchetype?: string;
}

const filterCardClass =
  "flex flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)/80 backdrop-blur-sm";

function FiltersCard({
  search,
  onSearchChange,
  onSearchSubmit,
  filters,
  onFiltersChange,
  className,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  filters: CardFilters;
  onFiltersChange: (filters: CardFilters) => void;
  className?: string;
}) {
  return (
    <div className={cn(filterCardClass, className)}>
      <div className="shrink-0 border-b border-(--color-border) p-4">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        />
      </div>
      <CardFiltersPanel
        filters={filters}
        onChange={onFiltersChange}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
      />
    </div>
  );
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded-md border border-(--color-border) bg-(--color-surface-2) p-0.5"
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
        aria-label="Grid view"
        className={cn(
          "rounded-sm p-1.5 transition-colors",
          mode === "grid"
            ? "bg-(--color-surface-1) text-(--color-foreground)"
            : "text-(--color-foreground-subtle) hover:text-(--color-foreground)"
        )}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={mode === "list"}
        aria-label="List view"
        className={cn(
          "rounded-sm p-1.5 transition-colors",
          mode === "list"
            ? "bg-(--color-surface-1) text-(--color-foreground)"
            : "text-(--color-foreground-subtle) hover:text-(--color-foreground)"
        )}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}

export function CardBrowser({
  showFilters = true,
  className,
  initialArchetype,
}: CardBrowserProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CardFilters>(() => ({
    ...DEFAULT_CARD_FILTERS,
    ...(initialArchetype ? { archetype: initialArchetype } : {}),
  }));
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const debouncedSearch = useDebounce(search, 350);

  const { cards, isLoading, isError, refetch } =
    useBrowseCards(debouncedSearch, filters);

  usePageView("page_view_cards");

  const handleSearchSubmit = useCallback((query: string) => {
    if (!query) return;
    track("card_search", { query });
  }, []);

  const handleCardClick = useCallback((card: Card) => {
    track("card_view", { cardId: card.id, cardName: card.name });
    setSelectedCard(card);
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      {showFilters && (
        <div className="flex shrink-0 justify-end lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
          >
            <SlidersHorizontal className="size-4" />
            {filtersOpen ? "Hide filters" : "Filters & search"}
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 items-stretch gap-6">
        {showFilters && (
          <FiltersCard
            search={search}
            onSearchChange={setSearch}
            onSearchSubmit={handleSearchSubmit}
            filters={filters}
            onFiltersChange={setFilters}
            className="hidden w-64 shrink-0 min-h-0 lg:flex"
          />
        )}

        <div className="flex min-h-0 min-w-0 flex-1 gap-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
              
              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
              {viewMode === "grid" ? (
                <CardGrid
                  cards={cards}
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage="Failed to load cards. Try again."
                  onRetry={() => void refetch()}
                  onCardClick={handleCardClick}
                  selectedCardId={selectedCard?.id ?? null}
                  columns={selectedCard ? 4 : 6}
                  emptyMessage={
                    debouncedSearch
                      ? `No cards found for "${debouncedSearch}".`
                      : "No cards match the current filters."
                  }
                />
              ) : (
                <CardList
                  cards={cards}
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage="Failed to load cards. Try again."
                  onRetry={() => void refetch()}
                  onCardClick={handleCardClick}
                  selectedCardId={selectedCard?.id ?? null}
                  emptyMessage={
                    debouncedSearch
                      ? `No cards found for "${debouncedSearch}".`
                      : "No cards match the current filters."
                  }
                />
              )}
            </div>
          </div>

          <CardDetailPanel card={selectedCard} onClose={() => setSelectedCard(null)} />
        </div>
      </div>

      {showFilters && filtersOpen && (
        <FiltersCard
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFiltersChange={setFilters}
          className="max-h-96 lg:hidden"
        />
      )}
    </div>
  );
}
