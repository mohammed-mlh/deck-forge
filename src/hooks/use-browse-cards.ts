"use client";

import { useMemo } from "react";
import { useCards, useInitialCards } from "@/hooks/use-cards";
import {
  finalizeCards,
  filtersNeedApi,
  filtersToApiParams,
  type CardFilters,
} from "@/lib/card-filters";
import { buildCardQueryParams } from "@/lib/ygoprodeck";

export function useBrowseCards(search: string, filters: CardFilters) {
  const useApi = filtersNeedApi(search, filters);

  const queryParams = useMemo(() => {
    const api = filtersToApiParams(search, filters);
    return buildCardQueryParams(search, api);
  }, [search, filters]);

  const apiQuery = useCards(queryParams, { enabled: useApi });
  const initialQuery = useInitialCards({ enabled: !useApi });

  const rawCards = useApi ? (apiQuery.data ?? []) : (initialQuery.data ?? []);
  const cards = useMemo(() => finalizeCards(rawCards, filters), [rawCards, filters]);

  return {
    cards,
    isLoading: useApi ? apiQuery.isLoading : initialQuery.isLoading,
    isFetching: useApi ? apiQuery.isFetching : initialQuery.isFetching,
    isError: useApi ? apiQuery.isError : initialQuery.isError,
    error: useApi ? apiQuery.error : initialQuery.error,
    isBrowsing: !useApi,
    queryParams,
    refetch: () => (useApi ? apiQuery.refetch() : initialQuery.refetch()),
  };
}
