"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { allCardsQuery, buildCardQueryParams, fetchCards } from "@/lib/ygoprodeck";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });

    const initialParams = buildCardQueryParams("", { type: "all" });
    queryClient.prefetchQuery({
      queryKey: ["cards", initialParams],
      queryFn: () => fetchCards(initialParams),
    });
    queryClient.prefetchQuery(allCardsQuery);

    return queryClient;
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
