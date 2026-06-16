"use client";

import { useQuery } from "@tanstack/react-query";
import { INITIAL_CARD_IDS } from "@/lib/initial-cards";
import { fetchCards, fetchCardsByIds } from "@/lib/ygoprodeck-sdk";
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

export function useInitialCards(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cards", "initial"],
    queryFn: () => fetchCardsByIds([...INITIAL_CARD_IDS]),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
