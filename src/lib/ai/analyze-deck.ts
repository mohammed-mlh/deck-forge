import type { DeckAnalysis, DeckContext } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";

const MOCK_DECK_ANALYSIS: DeckAnalysis = {
  summary: "",
  strengths: [],
  weaknesses: [],
  suggestions: [],
};

export function analyzeDeck(_input: Deck | DeckContext): DeckAnalysis {
  return MOCK_DECK_ANALYSIS;
}
