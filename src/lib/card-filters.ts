import type { CardSearchParams, CardTypeFilter, YugiohCard } from "@/types/yugioh";

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
  scaleMin: number;
  scaleMax: number;
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
  scaleMin: BOUNDS.scale.min,
  scaleMax: BOUNDS.scale.max,
  sort: "name",
};

function rangeActive(min: number, max: number, bounds: { min: number; max: number }) {
  return min > bounds.min || max < bounds.max;
}

export function filtersNeedApi(search: string, filters: CardFilters): boolean {
  return Boolean(
    search.trim() ||
      filters.attribute ||
      filters.archetype?.trim() ||
      filters.frames.length ||
      filters.linkMarkers.length ||
      filters.monsterRace.trim() ||
      filters.spellRace.trim() ||
      filters.trapRace.trim() ||
      filters.hasEffect ||
      filters.type === "spell" ||
      filters.type === "trap" ||
      rangeActive(filters.levelMin, filters.levelMax, BOUNDS.level) ||
      rangeActive(filters.atkMin, filters.atkMax, BOUNDS.atk) ||
      rangeActive(filters.defMin, filters.defMax, BOUNDS.def) ||
      rangeActive(filters.linkMin, filters.linkMax, BOUNDS.link) ||
      rangeActive(filters.scaleMin, filters.scaleMax, BOUNDS.scale)
  );
}

export function filtersToApiParams(
  search: string,
  filters: CardFilters
): CardSearchParams {
  const params: CardSearchParams = {};

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
    if (filters.levelMin > BOUNDS.level.min) params.levelMin = String(filters.levelMin);
    if (filters.levelMax < BOUNDS.level.max) params.levelMax = String(filters.levelMax);
  }
  if (rangeActive(filters.atkMin, filters.atkMax, BOUNDS.atk)) {
    if (filters.atkMin > BOUNDS.atk.min) params.atkMin = String(filters.atkMin);
    if (filters.atkMax < BOUNDS.atk.max) params.atkMax = String(filters.atkMax);
  }
  if (rangeActive(filters.defMin, filters.defMax, BOUNDS.def)) {
    if (filters.defMin > BOUNDS.def.min) params.defMin = String(filters.defMin);
    if (filters.defMax < BOUNDS.def.max) params.defMax = String(filters.defMax);
  }
  if (rangeActive(filters.linkMin, filters.linkMax, BOUNDS.link)) {
    if (filters.linkMin > BOUNDS.link.min) params.linkMin = String(filters.linkMin);
    if (filters.linkMax < BOUNDS.link.max) params.linkMax = String(filters.linkMax);
  }
  if (rangeActive(filters.scaleMin, filters.scaleMax, BOUNDS.scale)) {
    if (filters.scaleMin > BOUNDS.scale.min) params.scaleMin = String(filters.scaleMin);
    if (filters.scaleMax < BOUNDS.scale.max) params.scaleMax = String(filters.scaleMax);
  }

  return params;
}

export function filterCardsByType(
  cards: YugiohCard[],
  type: CardTypeFilter = "all"
): YugiohCard[] {
  if (type === "all") return cards;
  if (type === "monster") return cards.filter((c) => c.type.includes("Monster"));
  if (type === "spell") return cards.filter((c) => c.type.includes("Spell"));
  if (type === "trap") return cards.filter((c) => c.type.includes("Trap"));
  return cards;
}

function sortCards(cards: YugiohCard[], sort: CardSort): YugiohCard[] {
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

export function finalizeCards(cards: YugiohCard[], filters: CardFilters): YugiohCard[] {
  return sortCards(filterCardsByType(cards, filters.type), filters.sort);
}

export function toggleInList(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export { BOUNDS as FILTER_BOUNDS };
