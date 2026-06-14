import { db } from "@/db";
import {
  analyticsEvents,
  type AnalyticsEventRecord,
  type NewAnalyticsEventRecord,
} from "@/db/schema/analytics-events";

export async function insertAnalyticsEvent(
  values: NewAnalyticsEventRecord
): Promise<AnalyticsEventRecord> {
  const rows = await db.insert(analyticsEvents).values(values).returning();
  return rows[0];
}
