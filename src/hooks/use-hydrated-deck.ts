"use client";

import { useQuery } from "@tanstack/react-query";
import { hydrateDeck } from "@/lib/decks/deck-hydration";
import type { SavedDeck } from "@/types/deck";

export function useHydratedDeck(savedDeck: SavedDeck | undefined) {
  return useQuery({
    queryKey: ["hydrate-deck", savedDeck?.id],
    queryFn: () => hydrateDeck(savedDeck!),
    enabled: Boolean(savedDeck),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  });
}

export function useHydratedDeckOrEmpty(savedDeck: SavedDeck | undefined) {
  const query = useHydratedDeck(savedDeck);

  if (!savedDeck) {
    return { deck: undefined, isLoading: false };
  }

  return {
    deck: query.data,
    isLoading: query.isPending,
  };
}
