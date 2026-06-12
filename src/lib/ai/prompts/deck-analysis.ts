import type { DeckContext } from "@/lib/ai/types";

export function buildDeckAnalysisPrompt(context: DeckContext): string {
  const payload = {
    name: context.name,
    archetype: context.archetype,
    identity: context.identity,
    stats: context.stats,
    typeDistribution: context.typeDistribution,
    monsterBreakdown: context.monsterBreakdown,
    averageMonsterStats: context.averageMonsterStats,
    keyCards: context.keyCards,
    consistencySignals: context.consistencySignals,
    rawCards: context.rawCards,
  };

  return `You are a Yu-Gi-Oh! TCG deck analyst. Analyze the deck data below and respond with JSON only.

Rules:
- Use only the provided deck data. Do not invent cards not listed.
- Be concise and practical.
- Suggestions must be actionable and tied to the deck's weaknesses.
- priority must be one of: "low", "medium", "high"

Required JSON shape:
{
  "summary": "string",
  "strengths": [{ "title": "string", "description": "string" }],
  "weaknesses": [{ "title": "string", "description": "string" }],
  "suggestions": [{ "title": "string", "description": "string", "priority": "low" | "medium" | "high" }]
}

Deck data:
${JSON.stringify(payload, null, 2)}`;
}
