import { isDeckPayload } from "@/lib/ai/is-deck-payload";
import { assertAiRateLimit } from "@/lib/auth/rate-limit";
import { requireUserId } from "@/lib/auth/require-user";
import { analyzeDeck } from "@/lib/ai/analyze-deck";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    assertAiRateLimit(userId);

    const body: unknown = await req.json();
    if (!isDeckPayload(body)) {
      return Response.json({ error: "Invalid deck payload" }, { status: 400 });
    }

    const analysis = await analyzeDeck(body);
    return Response.json(analysis);
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
