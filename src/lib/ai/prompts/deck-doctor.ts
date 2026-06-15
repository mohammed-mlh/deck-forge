import type { DeckAnalysis, DeckContext } from "@/lib/ai/types";
import { buildDeckContextPayload } from "@/lib/ai/prompts/deck-context-payload";

function buildAnalysisSection(analysis?: DeckAnalysis): string {
  if (analysis) {
    return `Prior deck analysis (use scores, weaknesses, and suggestions to guide your remove/add package):
${JSON.stringify(analysis, null, 2)}`;
  }

  return `No prior analysis provided. Infer the deck's main weaknesses from the deck data before proposing changes.`;
}

export function buildDeckDoctorPrompt(context: DeckContext, analysis?: DeckAnalysis): string {
  const payload = buildDeckContextPayload(context);
  const mainSize = context.stats.mainSize;
  const mainDelta = 40 - mainSize;
  const mainTargetNote =
    mainDelta > 0
      ? `Main is ${mainSize} — add ${mainDelta} more card(s) to main (main adds minus main removes = +${mainDelta}).`
      : mainDelta < 0
        ? `Main is ${mainSize} — remove ${Math.abs(mainDelta)} card(s) from main (main removes minus main adds = ${Math.abs(mainDelta)}).`
        : "Main is already 40 — any main removes MUST be matched with equal main adds (1-for-1 swaps only).";

  return `You are a Yu-Gi-Oh! TCG deck doctor. Propose a focused side-grade for the deck below. Respond with JSON only.

Rules:
- Base changes on the deck analysis when provided — target low scores and listed weaknesses first.
- "remove": cards currently IN the deck that should be cut. Use exact names from rawCards.
- "add": specific Yu-Gi-Oh! cards to bring in (real card names). Do not list cards already in the deck unless increasing quantity.
- Each change needs "name" and "quantity" (1-3). Optional "zone": "main" | "extra" | "side".
- Prefer 2-5 total changes (combined remove + add). Be specific, not generic.
- "reason": one short paragraph explaining why this package improves the deck, referencing analysis findings when available.
- Respect zone limits: extra 0-15, side 0-15.

Main deck constraint (MANDATORY — highest priority):
- Tournament main deck MUST be exactly 40 cards after all changes.
- Current main deck size: ${mainSize}. Target: 40.
- ${mainTargetNote}
- Only count "main" zone entries toward this balance (default zone to "main" when the card lives in main).
- Never leave main above or below 40. Verify: mainSize - mainRemoves + mainAdds = 40 before responding.

Required JSON shape:
{
  "remove": [{ "name": "string", "quantity": 1, "zone": "main" | "extra" | "side" }],
  "add": [{ "name": "string", "quantity": 1, "zone": "main" | "extra" | "side" }],
  "reason": "string"
}

${buildAnalysisSection(analysis)}

Deck data:
${JSON.stringify(payload, null, 2)}`;
}
