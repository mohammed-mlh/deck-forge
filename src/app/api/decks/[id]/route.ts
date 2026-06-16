import { updateDeckSchema } from "@/features/decks/decks.schema";
import { deleteDeck, getDeckById, updateDeck } from "@/features/decks/decks.service";
import { toSavedDeck } from "@/features/decks/decks.service";
import { requireUserId } from "@/lib/auth/require-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const record = await getDeckById(userId, id);
    if (!record) {
      return Response.json({ error: "Deck not found" }, { status: 404 });
    }
    const deck = await toSavedDeck(record);
    return Response.json({ deck });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to load deck";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const body: unknown = await req.json();
    const parsed = updateDeckSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const record = await updateDeck(userId, id, parsed.data);
    if (!record) {
      return Response.json({ error: "Deck not found" }, { status: 404 });
    }
    const deck = await toSavedDeck(record);
    return Response.json({ deck });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to update deck";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const deleted = await deleteDeck(userId, id);
    if (!deleted) {
      return Response.json({ error: "Deck not found" }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof Response) return err;
    const message = err instanceof Error ? err.message : "Failed to delete deck";
    return Response.json({ error: message }, { status: 500 });
  }
}
