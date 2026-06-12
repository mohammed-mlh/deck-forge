import { buildDeckContext } from "@/lib/ai/deck-context";
import { getAiProvider, type AiProvider } from "@/lib/ai/provider";
import { sanitizeDeckDoctorResult } from "@/lib/ai/sanitize-deck-doctor";
import type { DeckDoctorResult, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";

export async function improveDeck(
  input: Deck | DeckContext,
  provider: AiProvider = getAiProvider()
): Promise<DeckDoctorResult> {
  const deck = "rawCards" in input ? null : input;
  const context = deck ? buildDeckContext(deck) : input;
  const result = await provider.improveDeck(context);
  return deck ? sanitizeDeckDoctorResult(result, deck) : result;
}
