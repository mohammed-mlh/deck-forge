import { queryOptions } from "@tanstack/react-query";
import type { CardSearchParams, YugiohApiResponse, YugiohCard } from "@/types/yugioh";

const API_BASE = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

export const INITIAL_BROWSE_PARAMS: CardSearchParams = {
  type: "all",
  num: 100,
  offset: 0,
};

export const INITIAL_CARD_COUNT = 100;

export function hasServerCardFilters(params: CardSearchParams): boolean {
  return Boolean(
    params.name?.trim() ||
      params.attribute ||
      params.archetype?.trim() ||
      params.levelMin ||
      params.levelMax ||
      params.atkMin ||
      params.atkMax ||
      params.race?.trim() ||
      (params.type && params.type !== "all" && params.type !== "monster")
  );
}

export function buildCardQueryParams(
  search: string,
  params: CardSearchParams
): CardSearchParams {
  const base = { ...params, type: params.type === "monster" ? "all" : params.type };

  if (search.trim() || hasServerCardFilters(base)) {
    const { num: _n, offset: _o, ...rest } = base;
    return rest;
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

function appendBoundedParam(
  search: URLSearchParams,
  key: string,
  min?: string,
  max?: string
) {
  if (min) search.append(key, `gte${min}`);
  if (max) search.append(key, `lte${max}`);
}

export function buildCardSearchUrl(params: CardSearchParams): string {
  const search = new URLSearchParams();

  if (params.name?.trim()) search.set("fname", params.name.trim());

  const apiType = mapTypeFilter(params.type);
  if (apiType) search.set("type", apiType);
  if (params.attribute) search.set("attribute", params.attribute);
  if (params.archetype?.trim()) search.set("archetype", params.archetype.trim());

  appendBoundedParam(search, "level", params.levelMin, params.levelMax);
  appendBoundedParam(search, "atk", params.atkMin, params.atkMax);

  const hasFilters = hasServerCardFilters(params);
  if (!params.name?.trim() && !hasFilters) {
    if (params.num) search.set("num", String(params.num));
    if (params.offset) search.set("offset", String(params.offset));
  }

  const query = search.toString();
  return query ? `${API_BASE}?${query}` : `${API_BASE}?num=100&offset=0`;
}

export async function fetchCards(params: CardSearchParams = {}): Promise<YugiohCard[]> {
  const key = buildCacheKey(params);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

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
