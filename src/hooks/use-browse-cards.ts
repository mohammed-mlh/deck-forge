"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCards } from "@/hooks/use-cards";
import {
  finalizeCards,
  filtersNeedApi,
  filtersToApiParams,
  filtersUseMonsterPool,
  type CardFilters,
} from "@/lib/card-filters";
import {
  INITIAL_BROWSE_PARAMS,
  INITIAL_CARD_COUNT,
  allCardsQuery,
  buildCardQueryParams,
} from "@/lib/ygoprodeck";

export function useBrowseCards(search: string, filters: CardFilters) {
  const useApi = filtersNeedApi(search, filters);
  const useMonsterPool = filtersUseMonsterPool(search, filters);

  const queryParams = useMemo(() => {
    const api = filtersToApiParams(search, filters);
    return buildCardQueryParams(search, api);
  }, [search, filters]);

  const allQuery = useQuery(allCardsQuery);
  const apiQuery = useCards(queryParams, { enabled: useApi });

  const rawCards = useApi
    ? (apiQuery.data ?? [])
    : useMonsterPool
      ? (allQuery.data ?? [])
      : (allQuery.data ?? []).slice(0, INITIAL_CARD_COUNT);

  const cards = useMemo(() => finalizeCards(rawCards, filters), [rawCards, filters]);

  return {
    cards,
    isLoading: useApi ? apiQuery.isLoading : allQuery.isLoading,
    isFetching: useApi ? apiQuery.isFetching : false,
    isError: useApi ? apiQuery.isError : allQuery.isError,
    error: useApi ? apiQuery.error : allQuery.error,
    isBrowsing: !useApi && !useMonsterPool,
    queryParams: useApi ? queryParams : INITIAL_BROWSE_PARAMS,
  };
}
