import { buildDeckContext } from "@/lib/ai/deck-context";
import { getAiProvider, type AiProvider } from "@/lib/ai/provider";
import type { DeckAnalysis, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/features/decks/decks.schema";

export async function analyzeDeck(
  input: Deck | DeckContext,
  provider: AiProvider = getAiProvider()
): Promise<DeckAnalysis> {
  const context = "rawCards" in input ? input : buildDeckContext(input);
  return provider.analyzeDeck(context);
}
