"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCards } from "@/hooks/use-cards";
import {
  INITIAL_BROWSE_PARAMS,
  INITIAL_CARD_COUNT,
  allCardsQuery,
  buildCardQueryParams,
  filterCardsByType,
  hasActiveCardFilters,
} from "@/lib/ygoprodeck";
import type { CardSearchParams } from "@/types/yugioh";

export function useBrowseCards(search: string, filters: CardSearchParams) {
  const needsApiQuery = Boolean(search.trim()) || hasActiveCardFilters(filters);

  const queryParams = useMemo(
    () => buildCardQueryParams(search, filters),
    [search, filters]
  );

  const {
    data: allCards = [],
    isLoading: allLoading,
    isError: allError,
    error: allErrorObj,
  } = useQuery(allCardsQuery);

  const {
    data: fetchedCards = [],
    isLoading: fetchLoading,
    isFetching,
    isError: fetchError,
    error: fetchErrorObj,
  } = useCards(queryParams, { enabled: needsApiQuery });

  const rawCards = needsApiQuery
    ? fetchedCards
    : allCards.slice(0, INITIAL_CARD_COUNT);

  const cards = useMemo(
    () => filterCardsByType(rawCards, filters.type ?? "all"),
    [rawCards, filters.type]
  );

  return {
    cards,
    isLoading: needsApiQuery ? fetchLoading : allLoading,
    isFetching: needsApiQuery ? isFetching : false,
    isError: needsApiQuery ? fetchError : allError,
    error: needsApiQuery ? fetchErrorObj : allErrorObj,
    isBrowsing: !needsApiQuery,
    queryParams: needsApiQuery ? queryParams : INITIAL_BROWSE_PARAMS,
  };
}
