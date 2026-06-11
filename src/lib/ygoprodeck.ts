import { queryOptions } from "@tanstack/react-query";
import type { CardSearchParams, YugiohApiResponse, YugiohCard } from "@/types/yugioh";

const API_BASE = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

export const INITIAL_BROWSE_PARAMS: CardSearchParams = {
  type: "all",
  num: 100,
  offset: 0,
};

export const INITIAL_CARD_COUNT = 100;

export function hasServerCardFilters(filters: CardSearchParams): boolean {
  return Boolean(
    filters.attribute ||
      filters.level ||
      filters.archetype?.trim() ||
      (filters.type && filters.type !== "all" && filters.type !== "monster")
  );
}

export function hasActiveCardFilters(filters: CardSearchParams): boolean {
  return hasServerCardFilters(filters) || filters.type === "monster";
}

export function buildCardQueryParams(
  search: string,
  filters: CardSearchParams
): CardSearchParams {
  const base: CardSearchParams = {
    ...filters,
    type: filters.type === "monster" ? "all" : filters.type,
  };

  if (search.trim()) {
    return { ...base, name: search.trim() };
  }

  if (hasServerCardFilters(filters)) {
    const { num: _n, offset: _o, ...filterParams } = base;
    return filterParams;
  }

  return { ...base, ...INITIAL_BROWSE_PARAMS };
}

const cache = new Map<string, { data: YugiohCard[]; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function buildCacheKey(params: CardSearchParams): string {
  return JSON.stringify(params);
}

function mapTypeFilter(type: CardSearchParams["type"]): string | undefined {
  if (!type || type === "all" || type === "monster") return undefined;
  if (type === "spell") return "Spell Card";
  if (type === "trap") return "Trap Card";
  return undefined;
}

export function filterCardsByType(
  cards: YugiohCard[],
  type: CardSearchParams["type"] = "all"
): YugiohCard[] {
  if (!type || type === "all") return cards;
  if (type === "monster") return cards.filter((c) => c.type.includes("Monster"));
  if (type === "spell") return cards.filter((c) => c.type.includes("Spell"));
  if (type === "trap") return cards.filter((c) => c.type.includes("Trap"));
  return cards;
}

export function buildCardSearchUrl(params: CardSearchParams): string {
  const search = new URLSearchParams();

  if (params.name?.trim()) {
    search.set("fname", params.name.trim());
  }
  const apiType = mapTypeFilter(params.type);
  if (apiType) search.set("type", apiType);
  if (params.attribute) search.set("attribute", params.attribute);
  if (params.level) search.set("level", params.level);
  if (params.archetype?.trim()) search.set("archetype", params.archetype.trim());

  // YGOProDeck rejects num/offset combined with fname or filter params
  const hasNameSearch = Boolean(params.name?.trim());
  const hasFilterParams = Boolean(
    params.attribute ||
      params.level ||
      params.archetype?.trim() ||
      mapTypeFilter(params.type)
  );
  if (!hasNameSearch && !hasFilterParams) {
    if (params.num) search.set("num", String(params.num));
    if (params.offset) search.set("offset", String(params.offset));
  }

  const query = search.toString();
  return query ? `${API_BASE}?${query}` : `${API_BASE}?num=100&offset=0`;
}

export async function fetchCards(params: CardSearchParams = {}): Promise<YugiohCard[]> {
  const key = buildCacheKey(params);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const res = await fetch(buildCardSearchUrl(params));

  if (!res.ok) {
    if (res.status === 400) return [];
    throw new Error(`Failed to fetch cards: ${res.status}`);
  }

  const json = (await res.json()) as YugiohApiResponse;
  const data = json.data ?? [];

  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

export function getCardImageUrl(card: YugiohCard, size: "small" | "full" = "small"): string {
  const image = card.card_images[0];
  if (!image) return "";
  return size === "small" ? image.image_url_small : image.image_url;
}

export function getCardTypeLabel(card: YugiohCard): string {
  if (card.type.includes("Monster")) return "Monster";
  if (card.type.includes("Spell")) return "Spell";
  if (card.type.includes("Trap")) return "Trap";
  return card.type;
}

const EXTRA_FRAMES = new Set([
  "fusion",
  "synchro",
  "xyz",
  "link",
  "fusion_pendulum",
  "synchro_pendulum",
  "xyz_pendulum",
]);

export function isExtraDeckCard(card: YugiohCard): boolean {
  if (EXTRA_FRAMES.has(card.frameType)) return true;
  return /Fusion|Synchro|Xyz|Link/i.test(card.type);
}

let allCardsCache: Promise<YugiohCard[]> | null = null;

export function fetchAllCards(): Promise<YugiohCard[]> {
  if (allCardsCache) return allCardsCache;

  allCardsCache = fetch(API_BASE)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch cards");
      return res.json() as Promise<YugiohApiResponse>;
    })
    .then((json) => json.data ?? [])
    .catch((err) => {
      allCardsCache = null;
      throw err;
    });

  return allCardsCache;
}

export const allCardsQuery = queryOptions({
  queryKey: ["ygo", "all-cards"],
  queryFn: fetchAllCards,
  staleTime: 1000 * 60 * 60,
  gcTime: 1000 * 60 * 60 * 2,
});

export function extractArchetypes(cards: YugiohCard[], limit = 500): string[] {
  const set = new Set<string>();
  cards.forEach((c) => {
    if (c.archetype) set.add(c.archetype);
  });
  return [...set].sort().slice(0, limit);
}
