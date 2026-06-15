import type { DeckContext } from "@/lib/ai/types";
import { buildDeckContextPayload } from "@/lib/ai/prompts/deck-context-payload";

export function buildDeckAnalysisPrompt(context: DeckContext): string {
  const payload = buildDeckContextPayload(context);

  return `You are a Yu-Gi-Oh! TCG deck analyst. Analyze the deck data below and respond with JSON only.

Rules:
- Use only the provided deck data. Do not invent cards not listed.
- Be concise and practical.
- Suggestions must be actionable and tied to the deck's weaknesses.
- priority must be one of: "low", "medium", "high"
- All scores must be integers from 0-100

Score criteria definitions:
- consistency: How reliably the deck can draw into and execute its core strategy (search power, draw cards, ratios)
- power: Raw card strength, boss monsters, win conditions, and game-ending potential
- speed: How quickly the deck can establish its board state or threaten a win
- resilience: How well the deck recovers from disruption, negation, or board wipes
- flexibility: Ability to adapt to different matchups, side deck options, versatile cards
- synergy: How well the cards work together, combo potential, archetype cohesion
- overall: Weighted average considering all factors and competitive viability

Required JSON shape:
{
  "scores": {
    "overall": number,
    "consistency": number,
    "power": number,
    "speed": number,
    "resilience": number,
    "flexibility": number,
    "synergy": number
  },
  "summary": "string",
  "strengths": [{ "title": "string", "description": "string" }],
  "weaknesses": [{ "title": "string", "description": "string" }],
  "suggestions": [{ "title": "string", "description": "string", "priority": "low" | "medium" | "high" }]
}

Deck data:
${JSON.stringify(payload, null, 2)}`;
}
