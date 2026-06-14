"use client";

import { useEffect } from "react";
import { setAnalyticsProvider } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setAnalyticsProvider((event, payload) => {
      void fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, payload }),
        keepalive: true,
      });
    });

    return () => {
      setAnalyticsProvider(() => {});
    };
  }, []);

  return children;
}
