"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { allCardsQuery, extractArchetypes } from "@/lib/ygoprodeck";

export function useArchetypes(limit = 500) {
  const { data: cards = [] } = useQuery(allCardsQuery);

  return useMemo(() => extractArchetypes(cards, limit), [cards, limit]);
}
