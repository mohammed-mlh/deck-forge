import { buildDeckContext } from "@/lib/ai/deck-context";
import { getAiProvider, type AiProvider } from "@/lib/ai/provider";
import { sanitizeDeckDoctorResult } from "@/lib/ai/sanitize-deck-doctor";
import type { DeckAnalysis, DeckDoctorResult, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/features/decks/decks.schema";

export async function improveDeck(
  input: Deck | DeckContext,
  analysis?: DeckAnalysis,
  provider: AiProvider = getAiProvider()
): Promise<DeckDoctorResult> {
  if ("rawCards" in input) {
    return provider.improveDeck(input, analysis);
  }

  const context = buildDeckContext(input);
  const result = await provider.improveDeck(context, analysis);
  return sanitizeDeckDoctorResult(result, input);
}
