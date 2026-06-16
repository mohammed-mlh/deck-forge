import { createDeckSchema } from "@/features/decks/decks.schema";
import { createDeck, getUserDecks } from "@/features/decks/decks.service";
import { deckRecordsToSavedDecks, deckRecordToSavedDeck } from "@/features/decks/decks.mapper";
import { requireUserId } from "@/lib/auth/require-user";

export async function GET() {
  try {
    const userId = await requireUserId();
    const records = await getUserDecks(userId);
    const decks = await deckRecordsToSavedDecks(records);
    return Response.json({ decks });
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
    const deck = await deckRecordToSavedDeck(record);
    return Response.json({ deck }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to create deck";
    return Response.json({ error: message }, { status: 400 });
  }
}
