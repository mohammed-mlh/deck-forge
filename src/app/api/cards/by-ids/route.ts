import { cardIdsSchema } from "@/features/cards/cards.schema";
import { getCardsByIds } from "@/features/cards/cards.service";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = cardIdsSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = await getCardsByIds(parsed.data);
    return Response.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load cards";
    return Response.json({ error: message }, { status: 500 });
  }
}
