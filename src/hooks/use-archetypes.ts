"use client";

import { useQuery } from "@tanstack/react-query";
import type { ArchetypeRecord } from "@/db/schema/archetypes";

export function useArchetypes() {
  return useQuery({
    queryKey: ["archetypes"],
    queryFn: async () => {
      const res = await fetch("/api/archetypes");
      if (!res.ok) throw new Error("Failed to fetch archetypes");
      const json = (await res.json()) as { data: ArchetypeRecord[] };
      return json.data ?? [];
    },
    staleTime: 1000 * 60 * 60,
  });
}
