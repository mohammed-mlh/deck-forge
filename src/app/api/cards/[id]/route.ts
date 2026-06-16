import { getCardById } from "@/features/cards/cards.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cardId = Number.parseInt(id, 10);
    if (!Number.isFinite(cardId) || cardId <= 0) {
      return Response.json({ error: "Invalid card id" }, { status: 400 });
    }

    const card = await getCardById(cardId);
    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    return Response.json({ card });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load card";
    return Response.json({ error: message }, { status: 500 });
  }
}
