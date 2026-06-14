export const ANALYTICS_EVENTS = [
  "card_search",
  "card_view",
  "deck_created",
  "deck_saved",
  "deck_doctor_applied",
  "deck_copied",
  "deck_shared",
  "page_view_deck_builder",
  "page_view_cards",
  "page_view_deck",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type AnalyticsProvider = (event: AnalyticsEvent, payload?: AnalyticsPayload) => void;

let provider: AnalyticsProvider | null = null;

export function setAnalyticsProvider(fn: AnalyticsProvider) {
  provider = fn;
}

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  if (provider) {
    provider(event, payload);
    return;
  }

  console.log("[analytics]", {
    event,
    payload,
    timestamp: new Date().toISOString(),
  });
}
