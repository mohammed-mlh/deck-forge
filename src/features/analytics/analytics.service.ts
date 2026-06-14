import { insertAnalyticsEvent } from "@/features/analytics/analytics.repository";
import type { TrackEventInput } from "@/features/analytics/analytics.schema";
import type { AnalyticsEventRecord } from "@/db/schema/analytics-events";

export async function recordAnalyticsEvent(
  userId: string | null,
  input: TrackEventInput
): Promise<AnalyticsEventRecord> {
  return insertAnalyticsEvent({
    userId,
    event: input.event,
    payload: input.payload ?? {},
  });
}
