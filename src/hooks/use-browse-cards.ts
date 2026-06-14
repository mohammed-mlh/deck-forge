"use client";

import { useMemo } from "react";
import { useCards } from "@/hooks/use-cards";
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

  const browseParams = useMemo(
    () => buildCardQueryParams("", filtersToApiParams("", filters)),
    [filters]
  );

  const apiQuery = useCards(queryParams, { enabled: useApi });
  const browseQuery = useCards(browseParams, { enabled: !useApi });

  const rawCards = useApi ? (apiQuery.data ?? []) : (browseQuery.data ?? []);
  const cards = useMemo(() => finalizeCards(rawCards, filters), [rawCards, filters]);

  return {
    cards,
    isLoading: useApi ? apiQuery.isLoading : browseQuery.isLoading,
    isFetching: useApi ? apiQuery.isFetching : browseQuery.isFetching,
    isError: useApi ? apiQuery.isError : browseQuery.isError,
    error: useApi ? apiQuery.error : browseQuery.error,
    isBrowsing: !useApi,
    queryParams: useApi ? queryParams : browseParams,
    refetch: () => (useApi ? apiQuery.refetch() : browseQuery.refetch()),
  };
}
