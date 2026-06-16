"use client";

import { useQuery } from "@tanstack/react-query";
import type { Card, CardSearchInput } from "@/features/cards/cards.schema";

function cardSearchParams(query: CardSearchInput): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  return params;
}

export function useCards(
  params: CardSearchInput,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["cards", params],
    queryFn: async () => {
      const qs = cardSearchParams(params).toString();
      const res = await fetch(qs ? `/api/cards?${qs}` : "/api/cards");
      if (!res.ok) {
        if (res.status === 400) return [];
        throw new Error(`Failed to fetch cards: ${res.status}`);
      }
      const json = (await res.json()) as { data: Card[] };
      return json.data ?? [];
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
