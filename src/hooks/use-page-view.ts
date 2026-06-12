"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsEvent, type AnalyticsPayload } from "@/lib/analytics";

export function usePageView(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track(event, payload);
  }, [event, payload]);
}
