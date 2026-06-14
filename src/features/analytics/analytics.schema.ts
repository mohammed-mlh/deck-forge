import { z } from "zod";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

const payloadValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const trackEventSchema = z.object({
  event: z.enum(ANALYTICS_EVENTS),
  payload: z.record(z.string(), payloadValueSchema).optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
