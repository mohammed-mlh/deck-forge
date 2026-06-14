"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deckToCreateInput } from "@/features/decks/decks.mapper";
import type { Deck, SavedDeck } from "@/types/deck";

const DECKS_QUERY_KEY = ["user-decks"] as const;

async function fetchDecks(): Promise<SavedDeck[]> {
  const res = await fetch("/api/decks");
  if (!res.ok) {
    throw new Error("Failed to load decks");
  }
  const data = (await res.json()) as { decks: SavedDeck[] };
  return data.decks;
}

async function fetchDeckById(id: string): Promise<SavedDeck> {
  const res = await fetch(`/api/decks/${id}`);
  if (!res.ok) {
    throw new Error("Deck not found");
  }
  const data = (await res.json()) as { deck: SavedDeck };
  return data.deck;
}

export function useSavedDecks() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: DECKS_QUERY_KEY,
    queryFn: fetchDecks,
  });

  const saveMutation = useMutation({
    mutationFn: async (deck: Deck) => {
      const payload = deckToCreateInput(deck);
      const existing = listQuery.data?.some((d) => d.id === deck.id);
      const res = await fetch(existing ? `/api/decks/${deck.id}` : "/api/decks", {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existing ? payload : { ...payload, id: deck.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to save deck");
      }
      const data = (await res.json()) as { deck: SavedDeck };
      return data.deck;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<SavedDeck[]>(DECKS_QUERY_KEY, (prev = []) => {
        const index = prev.findIndex((d) => d.id === saved.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    },
  });

  const forkMutation = useMutation({
    mutationFn: async (payload: ReturnType<typeof deckToCreateInput>) => {
      const res = await fetch("/api/decks/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to copy deck");
      }
      const data = (await res.json()) as { deck: SavedDeck };
      return data.deck;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<SavedDeck[]>(DECKS_QUERY_KEY, (prev = []) => [saved, ...(prev ?? [])]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/decks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete deck");
      }
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<SavedDeck[]>(DECKS_QUERY_KEY, (prev = []) =>
        prev.filter((d) => d.id !== id)
      );
    },
  });

  const getById = useCallback(
    (id: string) => listQuery.data?.find((d) => d.id === id),
    [listQuery.data]
  );

  const fetchDeck = useCallback(
    async (id: string) => {
      const cached = queryClient
        .getQueryData<SavedDeck[]>(DECKS_QUERY_KEY)
        ?.find((d) => d.id === id);
      if (cached) return cached;

      const deck = await fetchDeckById(id);
      queryClient.setQueryData<SavedDeck[]>(DECKS_QUERY_KEY, (prev = []) => {
        if (prev.some((d) => d.id === deck.id)) return prev;
        return [deck, ...prev];
      });
      return deck;
    },
    [queryClient]
  );

  return {
    decks: listQuery.data ?? [],
    save: saveMutation.mutateAsync,
    fork: forkMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    getById,
    fetchDeck,
    ready: !listQuery.isLoading,
    isError: listQuery.isError,
  };
}

export function useSavedDeckById(deckId: string | null) {
  const { ready, getById, fetchDeck } = useSavedDecks();

  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => fetchDeck(deckId!),
    enabled: Boolean(deckId && ready && !getById(deckId!)),
    initialData: deckId ? getById(deckId) : undefined,
    staleTime: Infinity,
  });
}
