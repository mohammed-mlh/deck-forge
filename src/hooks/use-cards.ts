"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "@/lib/ygoprodeck";
import type { CardSearchParams } from "@/types/yugioh";

export function useCards(
  params: CardSearchParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["cards", params],
    queryFn: () => fetchCards(params),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
