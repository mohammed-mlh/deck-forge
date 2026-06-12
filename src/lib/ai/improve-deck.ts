import { buildDeckContext } from "@/lib/ai/deck-context";
import { getAiProvider, type AiProvider } from "@/lib/ai/provider";
import type { DeckDoctorResult, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";

export async function improveDeck(
  input: Deck | DeckContext,
  provider: AiProvider = getAiProvider()
): Promise<DeckDoctorResult> {
  const context = "rawCards" in input ? input : buildDeckContext(input);
  return provider.improveDeck(context);
}
