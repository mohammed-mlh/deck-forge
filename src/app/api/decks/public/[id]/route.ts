import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDeckById } from "@/features/decks/decks.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const record = await getPublicDeckById(id);
    if (!record) {
      return Response.json({ error: "Deck not found" }, { status: 404 });
    }
    return Response.json({ deck: deckRecordToSavedDeck(record) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load deck";
    return Response.json({ error: message }, { status: 500 });
  }
}
