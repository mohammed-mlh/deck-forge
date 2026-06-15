import type { AiProvider, DeckAnalysis, DeckContext, DeckDoctorResult } from "@/lib/ai/types";

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

    const consistency = consistencySignals.under40Main ? 40 : context.keyCards.some((c) => c.count >= 3) ? 75 : 60;
    const power = typeDistribution.monsters >= 15 ? 70 : 55;
    const speed = context.averageMonsterStats.level !== null && context.averageMonsterStats.level < 5 ? 75 : 55;
    const resilience = typeDistribution.traps >= 5 ? 65 : 45;
    const flexibility = stats.sideSize >= 10 ? 70 : 50;
    const synergy = context.archetype.confidence >= 0.5 ? 80 : context.archetype.confidence >= 0.25 ? 65 : 50;
    const overall = Math.round((consistency + power + speed + resilience + flexibility + synergy) / 6);

    const scores = { overall, consistency, power, speed, resilience, flexibility, synergy };

    return { scores, summary, strengths, weaknesses, suggestions };
  }

  async improveDeck(context: DeckContext, analysis?: DeckAnalysis): Promise<DeckDoctorResult> {
    const deckNames = new Set(context.rawCards.map((c) => c.name.toLowerCase()));
    const { stats, consistencySignals, keyCards } = context;
    const mainDelta = 40 - stats.mainSize;
    const remove: DeckDoctorResult["remove"] = [];
    const add: DeckDoctorResult["add"] = [];

    if (mainDelta < 0) {
      const trimCandidates = [
        ...consistencySignals.duplicatesOver3,
        ...keyCards.filter((c) => c.count > 2 && !c.name.includes("Ash Blossom")).map((c) => c.name),
      ];
      let remaining = Math.abs(mainDelta);
      for (const name of trimCandidates) {
        if (remaining <= 0) break;
        remove.push({ name, quantity: 1, zone: "main" });
        remaining -= 1;
      }
    } else if (mainDelta > 0) {
      const candidates = [
        "Ash Blossom & Joyous Spring",
        "Infinite Impermanence",
        "Pot of Prosperity",
      ];
      let remaining = mainDelta;
      for (const name of candidates) {
        if (remaining <= 0) break;
        if (!deckNames.has(name.toLowerCase())) {
          add.push({ name, quantity: 1, zone: "main" });
          remaining -= 1;
        }
      }
    } else {
      const trim = keyCards.find((c) => c.count > 2 && !c.name.includes("Ash Blossom"));
      if (trim) {
        remove.push({ name: trim.name, quantity: 1, zone: "main" });
      }
      if (!deckNames.has("ash blossom & joyous spring")) {
        add.push({ name: "Ash Blossom & Joyous Spring", quantity: 1, zone: "main" });
      } else if (!deckNames.has("infinite impermanence")) {
        add.push({ name: "Infinite Impermanence", quantity: 1, zone: "main" });
      }
    }

    const archetype = context.archetype.name ?? context.identity.archetype ?? "this strategy";
    const weakness = analysis?.weaknesses[0]?.title;
    const reason =
      mainDelta > 0
        ? `Main deck has ${stats.mainSize} cards — adding ${mainDelta} to reach the required 40${weakness ? ` and address ${weakness.toLowerCase()}` : ""}.`
        : mainDelta < 0
          ? `Main deck has ${stats.mainSize} cards — trimming ${Math.abs(mainDelta)} to reach exactly 40.`
          : `Swapping cards 1-for-1 in main to keep exactly 40 while improving ${archetype}.`;

    return { remove, add, reason };
  }
}
