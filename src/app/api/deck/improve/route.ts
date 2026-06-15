import { isDeckPayload } from "@/lib/ai/is-deck-payload";
import { analyzeDeck } from "@/lib/ai/analyze-deck";
import { improveDeck } from "@/lib/ai/improve-deck";
import {
  createDeckAnalysis,
  getLatestDeckAnalysis,
} from "@/features/deck-analyses/deck-analyses.service";
import { assertAiRateLimit } from "@/lib/auth/rate-limit";
import { requireUserId } from "@/lib/auth/require-user";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    assertAiRateLimit(userId);

    const body: unknown = await req.json();
    if (!isDeckPayload(body)) {
      return Response.json({ error: "Invalid deck payload" }, { status: 400 });
    }

    let analysis = (await getLatestDeckAnalysis(userId, body.id))?.analysis;
    if (!analysis) {
      analysis = await analyzeDeck(body);
      await createDeckAnalysis(userId, { deckId: body.id, analysis });
    }

    const result = await improveDeck(body, analysis);
    return Response.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Deck doctor failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
