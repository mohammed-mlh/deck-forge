"use client";

import { useMemo } from "react";
import { useCards } from "@/hooks/use-cards";
import {
  buildCardSearchQuery,
  finalizeCards,
  type CardFilters,
} from "@/lib/card-filters";

export function useBrowseCards(search: string, filters: CardFilters) {
  const queryParams = useMemo(
    () => buildCardSearchQuery(search, filters),
    [search, filters]
  );

  const query = useCards(queryParams);
  const cards = useMemo(
    () => finalizeCards(query.data ?? [], filters),
    [query.data, filters]
  );

  return {
    cards,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    queryParams,
    refetch: () => query.refetch(),
  };
}
