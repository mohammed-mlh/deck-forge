import { auth } from "@clerk/nextjs/server";
import { recordAnalyticsEvent } from "@/features/analytics/analytics.service";
import { trackEventSchema } from "@/features/analytics/analytics.schema";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = trackEventSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { userId } = await auth();
    await recordAnalyticsEvent(userId ?? null, parsed.data);

    return new Response(null, { status: 204 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to record event";
    return Response.json({ error: message }, { status: 500 });
  }
}
