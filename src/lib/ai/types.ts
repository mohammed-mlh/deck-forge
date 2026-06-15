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

export interface DeckScores {
  overall: number;
  consistency: number;
  power: number;
  speed: number;
  resilience: number;
  flexibility: number;
  synergy: number;
}

export interface DeckAnalysis {
  scores: DeckScores;
  summary: string;
  strengths: DeckStrength[];
  weaknesses: DeckWeakness[];
  suggestions: DeckSuggestion[];
}

export interface DeckDoctorCardChange {
  name: string;
  quantity: number;
  zone?: DeckZoneHint;
}

export type DeckZoneHint = "main" | "extra" | "side";

export interface DeckDoctorResult {
  remove: DeckDoctorCardChange[];
  add: DeckDoctorCardChange[];
  reason: string;
}

export interface AiProvider {
  analyzeDeck(context: DeckContext): Promise<DeckAnalysis>;
  improveDeck(context: DeckContext, analysis?: DeckAnalysis): Promise<DeckDoctorResult>;
}
