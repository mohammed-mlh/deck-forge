import { findDeckById } from "@/features/decks/decks.repository";
import {
  findDeckAnalysesByDeckId,
  findLatestDeckAnalysisByDeckId,
  insertDeckAnalysis,
} from "@/features/deck-analyses/deck-analyses.repository";
import type { CreateDeckAnalysisInput } from "@/features/deck-analyses/deck-analyses.schema";
import { deckAnalysisSchema } from "@/lib/ai/schemas";
import type { DeckAnalysisRecord } from "@/db/schema/deck-analyses";
import type { DeckAnalysis } from "@/lib/ai/types";

export interface LatestDeckAnalysis {
  analysis: DeckAnalysis;
  createdAt: Date;
}

export async function getLatestDeckAnalysis(
  userId: string,
  deckId: string
): Promise<LatestDeckAnalysis | null> {
  const deck = await findDeckById(deckId);
  if (!deck || deck.userId !== userId) return null;

  const record = await findLatestDeckAnalysisByDeckId(deckId);
  if (!record) return null;

  const parsed = deckAnalysisSchema.safeParse(record.analysis);
  if (!parsed.success) return null;

  return { analysis: parsed.data, createdAt: record.createdAt };
}

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
