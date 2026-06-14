"use client";

import { useQuery } from "@tanstack/react-query";
import { archetypesQuery } from "@/lib/ygoprodeck-sdk";

export function useArchetypes() {
  return useQuery(archetypesQuery);
}
