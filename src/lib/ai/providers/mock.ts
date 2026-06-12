import type { AiProvider, DeckAnalysis, DeckContext } from "@/lib/ai/types";

export class MockAiProvider implements AiProvider {
  async analyzeDeck(context: DeckContext): Promise<DeckAnalysis> {
    const archetype = context.archetype.name ?? context.identity.archetype ?? "mixed";
    const { stats, typeDistribution, consistencySignals } = context;

    const summary =
      `${context.name} is a ${archetype} deck with ${stats.mainSize} main, ` +
      `${stats.extraSize} extra, and ${stats.sideSize} side cards. ` +
      `The list runs ${typeDistribution.monsters} monsters, ${typeDistribution.spells} spells, and ${typeDistribution.traps} traps.`;

    const strengths: DeckAnalysis["strengths"] = [
      {
        title: "Strong monster lineup",
        description: `${typeDistribution.monsters} monsters provide a solid monster base for the strategy.`,
      },
    ];

    if (context.archetype.confidence >= 0.25) {
      strengths.push({
        title: "Clear archetype focus",
        description: `${archetype} cards make up ${Math.round(context.archetype.confidence * 100)}% of the deck.`,
      });
    }

    if (context.keyCards.some((c) => c.count >= 3)) {
      strengths.push({
        title: "Good consistency",
        description: "Several core cards appear at maximum useful ratios.",
      });
    }

    const weaknesses: DeckAnalysis["weaknesses"] = [];

    if (consistencySignals.under40Main) {
      weaknesses.push({
        title: "Undersized main deck",
        description: `Main deck has ${stats.mainSize} cards; tournament lists need at least 40.`,
      });
    }

    if (typeDistribution.traps < 3) {
      weaknesses.push({
        title: "Weak backrow",
        description: "Low trap count may leave the deck with limited disruption on the opponent's turn.",
      });
    }

    if (typeDistribution.spells + typeDistribution.traps < typeDistribution.monsters * 0.4) {
      weaknesses.push({
        title: "Low non-monster support",
        description: "Spell and trap ratios are thin relative to monsters, which can reduce interaction.",
      });
    }

    if (weaknesses.length === 0) {
      weaknesses.push({
        title: "Limited disruption",
        description: "The deck may struggle to interrupt strong opponent boards without more interaction.",
      });
    }

    const suggestions: DeckAnalysis["suggestions"] = [];

    if (consistencySignals.under40Main) {
      suggestions.push({
        title: "Reach 40 main deck cards",
        description: `Add ${40 - stats.mainSize} more main deck cards to reach a legal tournament size.`,
        priority: "high",
      });
    }

    suggestions.push({
      title: "Add Ash Blossom & Joyous Spring",
      description: "A hand trap improves matchup spread against combo decks.",
      priority: "medium",
    });

    if (context.averageMonsterStats.level !== null && context.averageMonsterStats.level >= 6) {
      suggestions.push({
        title: "Reduce high-level bricks",
        description: "Average monster level is high; trim expensive monsters that do not advance your game plan.",
        priority: "medium",
      });
    }

    suggestions.push({
      title: "Tighten extra deck ratios",
      description: "Review extra deck slots to ensure every card is reachable and contributes to your win condition.",
      priority: "low",
    });

    return { summary, strengths, weaknesses, suggestions };
  }
}
