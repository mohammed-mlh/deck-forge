import { findDeckById } from "@/features/decks/decks.repository";
import {
  findDeckAnalysesByDeckId,
  insertDeckAnalysis,
} from "@/features/deck-analyses/deck-analyses.repository";
import type { CreateDeckAnalysisInput } from "@/features/deck-analyses/deck-analyses.types";
import type { DeckAnalysisRecord } from "@/db/schema/deck-analyses";

export async function getDeckAnalyses(
  userId: string,
  deckId: string
): Promise<DeckAnalysisRecord[] | null> {
  const deck = await findDeckById(deckId);
  if (!deck || deck.userId !== userId) return null;
  return findDeckAnalysesByDeckId(deckId);
}

export async function createDeckAnalysis(
  userId: string,
  input: CreateDeckAnalysisInput
): Promise<DeckAnalysisRecord | null> {
  const deck = await findDeckById(input.deckId);
  if (!deck || deck.userId !== userId) return null;

  return insertDeckAnalysis({
    deckId: input.deckId,
    analysis: input.analysis,
  });
}
