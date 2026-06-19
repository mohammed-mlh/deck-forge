import type { PublicDeckRecord } from "@/db/schema/public-decks";
import type { DeckZoneRefs } from "@/features/decks/decks.schema";
import type { PublicDeckListItem } from "@/components/decks/public-decks-browser";
import { slugify } from "@/lib/slug";

export const UNCATEGORIZED = "Community";

export type PublicDeckSort = "popular" | "name" | "priceLow" | "priceHigh";

export const PUBLIC_DECK_SORTS: { value: PublicDeckSort; label: string }[] = [
  { value: "popular", label: "Most viewed" },
  { value: "name", label: "Name (A–Z)" },
  { value: "priceLow", label: "Price (low → high)" },
  { value: "priceHigh", label: "Price (high → low)" },
];

function countRefs(refs: DeckZoneRefs): number {
  return refs.reduce((sum, ref) => sum + ref.quantity, 0);
}

export function toListItem(deck: PublicDeckRecord): PublicDeckListItem {
  const meta = deck.metadata;
  const category = meta?.category ?? UNCATEGORIZED;
  return {
    id: deck.id,
    slug: deck.slug,
    categorySlug: categorySlug(category),
    name: deck.name,
    coverCard: meta?.coverCard ?? deck.main[0]?.id ?? 0,
    main: countRefs(deck.main),
    extra: countRefs(deck.extra),
    side: countRefs(deck.side),
    category,
    format: meta?.format ?? null,
    author: meta?.author ?? null,
    views: meta?.views ?? 0,
    price: meta?.price ?? 0,
    tournamentPlayer: meta?.tournament?.player ?? null,
  };
}

export function categorySlug(category: string): string {
  return slugify(category);
}

export interface CategorySummary {
  name: string;
  slug: string;
  count: number;
  coverCard: number;
}

export function summarizeCategories(items: PublicDeckListItem[]): CategorySummary[] {
  const groups = new Map<string, PublicDeckListItem[]>();
  for (const item of items) {
    const group = groups.get(item.category) ?? [];
    group.push(item);
    groups.set(item.category, group);
  }

  return [...groups.entries()]
    .map(([name, group]) => {
      const cover = [...group].sort((a, b) => b.views - a.views)[0]?.coverCard ?? 0;
      return { name, slug: categorySlug(name), count: group.length, coverCard: cover };
    })
    .sort((a, b) => b.count - a.count);
}
