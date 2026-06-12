import type { CardSearchParams, CardTypeFilter, YugiohCard } from "@/types/yugioh";

export type CardSort = "name" | "atk-desc" | "level-desc";

export interface CardFilters {
  type: CardTypeFilter;
  attribute?: string;
  archetype?: string;
  levelMin: number;
  levelMax: number;
  atkMin: number;
  atkMax: number;
  sort: CardSort;
}

export const DEFAULT_CARD_FILTERS: CardFilters = {
  type: "all",
  levelMin: 0,
  levelMax: 13,
  atkMin: 0,
  atkMax: 5000,
  sort: "name",
};

const LEVEL_MAX = 13;
const ATK_MAX = 5000;

function isLevelFiltered(f: CardFilters) {
  return f.levelMin > 0 || f.levelMax < LEVEL_MAX;
}

function isAtkFiltered(f: CardFilters) {
  return f.atkMin > 0 || f.atkMax < ATK_MAX;
}

export function filtersNeedApi(search: string, filters: CardFilters): boolean {
  return Boolean(
    search.trim() ||
      filters.attribute ||
      filters.archetype?.trim() ||
      filters.type === "spell" ||
      filters.type === "trap" ||
      isLevelFiltered(filters) ||
      isAtkFiltered(filters)
  );
}

export function filtersUseMonsterPool(search: string, filters: CardFilters): boolean {
  return filters.type === "monster" && !filtersNeedApi(search, filters);
}

export function filtersToApiParams(
  search: string,
  filters: CardFilters
): CardSearchParams {
  const params: CardSearchParams = {};

  if (search.trim()) params.name = search.trim();
  if (filters.attribute) params.attribute = filters.attribute;
  if (filters.archetype?.trim()) params.archetype = filters.archetype.trim();

  if (filters.type === "spell") params.type = "spell";
  if (filters.type === "trap") params.type = "trap";

  if (isLevelFiltered(filters)) {
    if (filters.levelMin > 0) params.levelMin = String(filters.levelMin);
    if (filters.levelMax < LEVEL_MAX) params.levelMax = String(filters.levelMax);
  }

  if (isAtkFiltered(filters)) {
    if (filters.atkMin > 0) params.atkMin = String(filters.atkMin);
    if (filters.atkMax < ATK_MAX) params.atkMax = String(filters.atkMax);
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
