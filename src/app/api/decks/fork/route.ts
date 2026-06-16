import { createDeckSchema } from "@/features/decks/decks.schema";
import { forkDeck } from "@/features/decks/decks.service";
import { toSavedDeck } from "@/features/decks/decks.service";
import { requireUserId } from "@/lib/auth/require-user";

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const body: unknown = await req.json();
    const parsed = createDeckSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const record = await forkDeck(userId, parsed.data);
    const deck = await toSavedDeck(record);
    return Response.json({ deck }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to copy deck";
    return Response.json({ error: message }, { status: 400 });
  }
}
