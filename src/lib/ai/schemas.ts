import { z } from "zod";
import type { DeckAnalysis } from "@/lib/ai/types";

const prioritySchema = z.enum(["low", "medium", "high"]);

export const deckAnalysisSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  weaknesses: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  suggestions: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      priority: prioritySchema,
    })
  ),
});

export function parseDeckAnalysis(data: unknown): DeckAnalysis {
  return deckAnalysisSchema.parse(data);
}

export function extractJsonFromModelText(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText);
}
