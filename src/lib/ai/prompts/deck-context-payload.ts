import type { DeckContext } from "@/lib/ai/types";

export function buildDeckContextPayload(context: DeckContext) {
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
