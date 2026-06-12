export interface DeckContextStats {
  mainSize: number;
  extraSize: number;
  sideSize: number;
}

export interface TypeDistribution {
  monsters: number;
  spells: number;
  traps: number;
}

export interface MonsterBreakdown {
  normal: number;
  effect: number;
  fusion: number;
  synchro: number;
  xyz: number;
  link: number;
  pendulum: number;
}

export interface KeyCard {
  name: string;
  count: number;
}

export interface ConsistencySignals {
  duplicatesOver3: string[];
  under40Main: boolean;
  extraDeckOverfilled: boolean;
}

export interface DeckArchetype {
  name: string | null;
  confidence: number;
}

export interface AverageMonsterStats {
  atk: number | null;
  def: number | null;
  level: number | null;
}

export interface DeckIdentity {
  archetype: string | null;
  playstyle: string | null;
}

export interface RawDeckCard {
  id: number;
  name: string;
  quantity: number;
  type: string;
  race: string | null;
  attribute: string | null;
}

export interface DeckContext {
  name: string;
  archetype: DeckArchetype;
  identity: DeckIdentity;
  stats: DeckContextStats;
  typeDistribution: TypeDistribution;
  monsterBreakdown: MonsterBreakdown;
  averageMonsterStats: AverageMonsterStats;
  keyCards: KeyCard[];
  consistencySignals: ConsistencySignals;
  rawCards: RawDeckCard[];
}

export type SuggestionPriority = "low" | "medium" | "high";

export interface DeckStrength {
  title: string;
  description: string;
}

export interface DeckWeakness {
  title: string;
  description: string;
}

export interface DeckSuggestion {
  title: string;
  description: string;
  priority: SuggestionPriority;
}

export interface DeckAnalysis {
  summary: string;
  strengths: DeckStrength[];
  weaknesses: DeckWeakness[];
  suggestions: DeckSuggestion[];
}

export interface AiProvider {
  analyzeDeck(context: DeckContext): Promise<DeckAnalysis>;
}
