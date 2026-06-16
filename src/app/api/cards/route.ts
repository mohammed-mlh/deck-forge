import { cardSearchSchema } from "@/features/cards/cards.schema";
import { getCards } from "@/features/cards/cards.service";

function searchParamsFromUrl(url: URL): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

export async function GET(req: Request) {
  try {
    const parsed = cardSearchSchema.safeParse(searchParamsFromUrl(new URL(req.url)));
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = await getCards(parsed.data);
    return Response.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load cards";
    return Response.json({ error: message }, { status: 500 });
  }
}
