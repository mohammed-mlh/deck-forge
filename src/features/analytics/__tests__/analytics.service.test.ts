import { describe, expect, it, vi, beforeEach } from "vitest";
import type { AnalyticsEventRecord } from "@/db/schema/analytics-events";

vi.mock("@/features/analytics/analytics.repository", () => ({
  insertAnalyticsEvent: vi.fn(),
}));

import { recordAnalyticsEvent } from "@/features/analytics/analytics.service";
import { insertAnalyticsEvent } from "@/features/analytics/analytics.repository";

const mockedInsert = vi.mocked(insertAnalyticsEvent);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recordAnalyticsEvent", () => {
  it("persists event with optional userId", async () => {
    const record = { id: "evt-1" } as AnalyticsEventRecord;
    mockedInsert.mockResolvedValue(record);

    const result = await recordAnalyticsEvent("user-1", {
      event: "deck_saved",
      payload: { deckId: "d1" },
    });

    expect(result).toBe(record);
    expect(mockedInsert).toHaveBeenCalledWith({
      userId: "user-1",
      event: "deck_saved",
      payload: { deckId: "d1" },
    });
  });

  it("stores anonymous events with empty payload default", async () => {
    mockedInsert.mockResolvedValue({ id: "evt-2" } as AnalyticsEventRecord);

    await recordAnalyticsEvent(null, { event: "page_view_cards" });

    expect(mockedInsert).toHaveBeenCalledWith({
      userId: null,
      event: "page_view_cards",
      payload: {},
    });
  });
});
