import type { DeckContext } from "@/lib/ai/types";

function buildDeckPayload(context: DeckContext) {
  return {
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
}

export function buildDeckDoctorPrompt(context: DeckContext): string {
  const payload = buildDeckPayload(context);

  return `You are a Yu-Gi-Oh! TCG deck doctor. Propose a focused side-grade for the deck below. Respond with JSON only.

Rules:
- "remove": cards currently IN the deck that should be cut. Use exact names from rawCards.
- "add": specific Yu-Gi-Oh! cards to bring in (real card names). Do not list cards already in the deck unless increasing quantity.
- Each change needs "name" and "quantity" (1-3). Optional "zone": "main" | "extra" | "side".
- Prefer 2-5 total changes (combined remove + add). Be specific, not generic.
- "reason": one short paragraph explaining why this package improves the deck.
- Respect zone limits: main 40-60, extra 0-15, side 0-15.
- If main is under 40, prioritize adds over removes.

Required JSON shape:
{
  "remove": [{ "name": "string", "quantity": 1, "zone": "main" | "extra" | "side" }],
  "add": [{ "name": "string", "quantity": 1, "zone": "main" | "extra" | "side" }],
  "reason": "string"
}

Deck data:
${JSON.stringify(payload, null, 2)}`;
}
