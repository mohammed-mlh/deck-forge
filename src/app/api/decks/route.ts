import { createDeckSchema } from "@/features/decks/decks.schema";
import { createDeck, getUserDecks } from "@/features/decks/decks.service";
import { requireUserId } from "@/lib/auth/require-user";
import { deckRecordToSavedDeck } from "@/lib/decks/deck-db-mapper";

export async function GET() {
  try {
    const userId = await requireUserId();
    const records = await getUserDecks(userId);
    return Response.json({ decks: records.map(deckRecordToSavedDeck) });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to load decks";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body: unknown = await req.json();
    const parsed = createDeckSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const record = await createDeck(userId, parsed.data);
    return Response.json({ deck: deckRecordToSavedDeck(record) }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to create deck";
    return Response.json({ error: message }, { status: 500 });
  }
}
