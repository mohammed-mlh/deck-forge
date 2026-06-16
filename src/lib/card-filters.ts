import type { Card, CardSearchInput, CardTypeFilter } from "@/features/cards/cards.schema";
export type CardSort = "name" | "atk-desc" | "def-desc" | "level-desc";

export interface CardFilters {
  type: CardTypeFilter;
  attribute?: string;
  archetype?: string;
  frames: string[];
  linkMarkers: string[];
  monsterRace: string;
  spellRace: string;
  trapRace: string;
  hasEffect: boolean;
  levelMin: number;
  levelMax: number;
  atkMin: number;
  atkMax: number;
  defMin: number;
  defMax: number;
  linkMin: number;
  linkMax: number;
  scaleValues: number[];
  sort: CardSort;
}

export const MONSTER_FRAMES: { value: string; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "effect", label: "Effect" },
  { value: "ritual", label: "Ritual" },
  { value: "fusion", label: "Fusion" },
  { value: "synchro", label: "Synchro" },
  { value: "xyz", label: "XYZ" },
  { value: "link", label: "Link" },
  { value: "pendulum", label: "Pendulum" },
];

export const LINK_MARKERS: { value: string; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "bottom-left", label: "Bottom-Left" },
  { value: "bottom-right", label: "Bottom-Right" },
  { value: "top-left", label: "Top-Left" },
  { value: "top-right", label: "Top-Right" },
];

export const SPELL_RACES = [
  "Normal",
  "Quick-Play",
  "Continuous",
  "Equip",
  "Field",
  "Ritual",
] as const;

export const TRAP_RACES = ["Normal", "Continuous", "Counter"] as const;

export const MONSTER_RACES = [
  "Aqua",
  "Beast",
  "Beast-Warrior",
  "Creator God",
  "Cyberse",
  "Dinosaur",
  "Divine-Beast",
  "Dragon",
  "Fairy",
  "Fiend",
  "Fish",
  "Illusion",
  "Insect",
  "Machine",
  "Plant",
  "Psychic",
  "Pyro",
  "Reptile",
  "Rock",
  "Sea Serpent",
  "Spellcaster",
  "Thunder",
  "Warrior",
  "Winged Beast",
  "Wyrm",
  "Zombie",
] as const;

const BOUNDS = {
  level: { min: 0, max: 13 },
  atk: { min: 0, max: 5000 },
  def: { min: 0, max: 5000 },
  link: { min: 1, max: 8 },
  scale: { min: 0, max: 13 },
} as const;

export const DEFAULT_CARD_FILTERS: CardFilters = {
  type: "all",
  frames: [],
  linkMarkers: [],
  monsterRace: "",
  spellRace: "",
  trapRace: "",
  hasEffect: false,
  levelMin: BOUNDS.level.min,
  levelMax: BOUNDS.level.max,
  atkMin: BOUNDS.atk.min,
  atkMax: BOUNDS.atk.max,
  defMin: BOUNDS.def.min,
  defMax: BOUNDS.def.max,
  linkMin: BOUNDS.link.min,
  linkMax: BOUNDS.link.max,
  scaleValues: [],
  sort: "name",
};

function rangeActive(min: number, max: number, bounds: { min: number; max: number }) {
  return min > bounds.min || max < bounds.max;
}

export function filtersToApiParams(
  search: string,
  filters: CardFilters
): CardSearchInput {
  const params: CardSearchInput = {};
  if (search.trim()) params.name = search.trim();
  if (filters.attribute) params.attribute = filters.attribute;
  if (filters.archetype?.trim()) params.archetype = filters.archetype.trim();
  if (filters.frames.length) params.frameType = filters.frames.join(",");
  if (filters.linkMarkers.length) params.linkmarker = filters.linkMarkers.join(",");
  if (filters.hasEffect) params.hasEffect = true;

  if (filters.type === "spell") {
    params.type = "spell";
    if (filters.spellRace.trim()) params.race = filters.spellRace.trim();
  } else if (filters.type === "trap") {
    params.type = "trap";
    if (filters.trapRace.trim()) params.race = filters.trapRace.trim();
  } else if (filters.monsterRace.trim()) {
    params.race = filters.monsterRace.trim();
  }

  if (rangeActive(filters.levelMin, filters.levelMax, BOUNDS.level)) {
    if (filters.levelMin > BOUNDS.level.min) params.levelMin = filters.levelMin;
    if (filters.levelMax < BOUNDS.level.max) params.levelMax = filters.levelMax;
  }
  if (rangeActive(filters.atkMin, filters.atkMax, BOUNDS.atk)) {
    if (filters.atkMin > BOUNDS.atk.min) params.atkMin = filters.atkMin;
    if (filters.atkMax < BOUNDS.atk.max) params.atkMax = filters.atkMax;
  }
  if (rangeActive(filters.defMin, filters.defMax, BOUNDS.def)) {
    if (filters.defMin > BOUNDS.def.min) params.defMin = filters.defMin;
    if (filters.defMax < BOUNDS.def.max) params.defMax = filters.defMax;
  }
  if (rangeActive(filters.linkMin, filters.linkMax, BOUNDS.link)) {
    if (filters.linkMin > BOUNDS.link.min) params.linkMin = filters.linkMin;
    if (filters.linkMax < BOUNDS.link.max) params.linkMax = filters.linkMax;
  }
  if (filters.scaleValues.length) {
    params.scaleMin = Math.min(...filters.scaleValues);
    params.scaleMax = Math.max(...filters.scaleValues);
  }

  return params;
}

export function hasServerCardFilters(params: CardSearchInput): boolean {  return Boolean(
    params.name?.trim() ||
      params.attribute ||
      params.archetype?.trim() ||
      params.frameType?.trim() ||
      params.linkmarker?.trim() ||
      params.levelMin !== undefined ||
      params.levelMax !== undefined ||
      params.atkMin !== undefined ||
      params.atkMax !== undefined ||
      params.defMin !== undefined ||
      params.defMax !== undefined ||
      params.linkMin !== undefined ||
      params.linkMax !== undefined ||
      params.scaleMin !== undefined ||
      params.scaleMax !== undefined ||
      params.race?.trim() ||
      params.hasEffect ||
      (params.type && params.type !== "all" && params.type !== "monster")
  );
}

export function buildCardSearchQuery(search: string, filters: CardFilters): CardSearchInput {
  const api = filtersToApiParams(search, filters);

  if (search.trim() || hasServerCardFilters(api)) {
    return Object.fromEntries(
      Object.entries(api).filter(([key]) => key !== "num" && key !== "offset")
    ) as CardSearchInput;
  }

  return { ...api, num: 100, offset: 0 };
}

export function filterCardsByType(
  cards: Card[],
  type: CardTypeFilter = "all"
): Card[] {
  if (type === "all") return cards;
  if (type === "monster") return cards.filter((c) => c.type.includes("Monster"));
  if (type === "spell") return cards.filter((c) => c.type.includes("Spell"));
  if (type === "trap") return cards.filter((c) => c.type.includes("Trap"));
  return cards;
}

function sortCards(cards: Card[], sort: CardSort): Card[] {
  const copy = [...cards];
  if (sort === "atk-desc") {
    copy.sort((a, b) => (b.atk ?? -1) - (a.atk ?? -1));
  } else if (sort === "def-desc") {
    copy.sort((a, b) => (b.def ?? -1) - (a.def ?? -1));
  } else if (sort === "level-desc") {
    copy.sort((a, b) => (b.level ?? b.rank ?? -1) - (a.level ?? a.rank ?? -1));
  } else {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy;
}

export function finalizeCards(cards: Card[], filters: CardFilters): Card[] {
  let result = filterCardsByType(cards, filters.type);
  if (filters.scaleValues.length) {
    const allowed = new Set(filters.scaleValues);
    result = result.filter((c) => c.scale !== null && allowed.has(c.scale));
  }
  return sortCards(result, filters.sort);
}

export function toggleInList(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export function toggleScaleValue(values: number[], value: number): number[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value].sort((a, b) => a - b);
}

export { BOUNDS as FILTER_BOUNDS };
