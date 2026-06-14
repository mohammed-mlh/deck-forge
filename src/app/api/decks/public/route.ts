import { deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { getPublicDecks } from "@/features/decks/decks.service";

export async function GET() {
  try {
    const records = await getPublicDecks();
    return Response.json({ decks: records.map(deckRecordToSavedDeck) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load public decks";
    return Response.json({ error: message }, { status: 500 });
  }
}
