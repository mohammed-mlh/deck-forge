import { analyzeDeck } from "@/lib/ai/analyze-deck";
import type { Deck } from "@/types/deck";

function isDeck(value: unknown): value is Deck {
  if (!value || typeof value !== "object") return false;
  const deck = value as Deck;
  return (
    typeof deck.id === "string" &&
    typeof deck.name === "string" &&
    Array.isArray(deck.main) &&
    Array.isArray(deck.extra) &&
    Array.isArray(deck.side)
  );
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!isDeck(body)) {
      return Response.json({ error: "Invalid deck payload" }, { status: 400 });
    }

    const analysis = await analyzeDeck(body);
    return Response.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
