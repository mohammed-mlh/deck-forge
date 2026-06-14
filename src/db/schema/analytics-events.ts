import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { AnalyticsPayload } from "@/lib/analytics";

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  event: text("event").notNull(),
  payload: jsonb("payload").$type<AnalyticsPayload>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AnalyticsEventRecord = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEventRecord = typeof analyticsEvents.$inferInsert;
