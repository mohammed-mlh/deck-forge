import { buildDeckContext } from "@/lib/ai/deck-context";
import { getAiProvider, type AiProvider } from "@/lib/ai/provider";
import { sanitizeDeckDoctorResult } from "@/lib/ai/sanitize-deck-doctor";
import type { DeckDoctorResult, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";

export async function improveDeck(
  input: Deck | DeckContext,
  provider: AiProvider = getAiProvider()
): Promise<DeckDoctorResult> {
  if ("rawCards" in input) {
    return provider.improveDeck(input);
  }

  const context = buildDeckContext(input);
  const result = await provider.improveDeck(context);
  return sanitizeDeckDoctorResult(result, input);
}
