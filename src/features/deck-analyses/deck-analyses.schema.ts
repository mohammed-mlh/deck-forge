import { z } from "zod";
import { deckAnalysisSchema } from "@/lib/ai/schemas";

export const createDeckAnalysisSchema = z.object({
  deckId: z.string().uuid(),
  analysis: deckAnalysisSchema,
});

export type CreateDeckAnalysisInput = z.infer<typeof createDeckAnalysisSchema>;
