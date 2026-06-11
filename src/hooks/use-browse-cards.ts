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
  hasServerCardFilters,
} from "@/lib/ygoprodeck";
import type { CardSearchParams } from "@/types/yugioh";

export function useBrowseCards(search: string, filters: CardSearchParams) {
  const hasSearch = Boolean(search.trim());
  const serverFilters = hasServerCardFilters(filters);
  const monsterOnly =
    filters.type === "monster" && !serverFilters && !hasSearch;
  const needsApiQuery = hasSearch || serverFilters;

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
    : monsterOnly
      ? allCards
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
    isBrowsing: !needsApiQuery && !monsterOnly,
    queryParams: needsApiQuery ? queryParams : INITIAL_BROWSE_PARAMS,
  };
}
