"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Coins, Eye, Search, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PublicDeckListItem {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  coverCard: number;
  main: number;
  extra: number;
  side: number;
  category: string;
  format: string | null;
  author: string | null;
  views: number;
  price: number;
  tournamentPlayer: string | null;
}

type SortKey = "popular" | "name" | "priceLow" | "priceHigh";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most viewed" },
  { value: "name", label: "Name (A–Z)" },
  { value: "priceLow", label: "Price (low → high)" },
  { value: "priceHigh", label: "Price (high → low)" },
];

const ALL = "All";

function cardArtUrl(id: number): string {
  return `https://images.ygoprodeck.com/images/cards_cropped/${id}.jpg`;
}

function DeckCard({ deck, showCategory }: { deck: PublicDeckListItem; showCategory: boolean }) {
  return (
    <Link
      href={`/app/decks/${deck.categorySlug}/${deck.slug}`}
      className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong)"
    >
      {deck.coverCard > 0 && (
        <Image
          src={cardArtUrl(deck.coverCard)}
          alt={deck.name}
          fill
          sizes="(max-width: 640px) 100vw, 360px"
          className="object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {showCategory && (
        <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
          {deck.category}
        </span>
      )}
      {deck.tournamentPlayer && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-(--color-warning)/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-warning) backdrop-blur-sm">
          <Trophy className="size-3" />
          {deck.tournamentPlayer}
        </span>
      )}

      <div className="relative flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-white drop-shadow">{deck.name}</h3>
        <p className="text-xs tabular-nums text-white/70">
          Main {deck.main} · Extra {deck.extra} · Side {deck.side}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-white/60">
          {deck.author && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {deck.author}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3" />
            {deck.views.toLocaleString()}
          </span>
          {deck.price > 0 && (
            <span className="inline-flex items-center gap-1">
              <Coins className="size-3" />${deck.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function PublicDecksBrowser({
  decks,
  showCategories = true,
}: {
  decks: PublicDeckListItem[];
  showCategories?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("popular");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const deck of decks) counts.set(deck.category, (counts.get(deck.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [decks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = decks.filter((deck) => {
      if (category !== ALL && deck.category !== category) return false;
      if (q && !deck.name.toLowerCase().includes(q)) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceLow":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted.sort((a, b) => b.views - a.views);
    }
    return sorted;
  }, [decks, query, category, sort]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-foreground-subtle)" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks by name…"
            className="w-full rounded-lg border border-(--color-border) bg-(--color-surface-1) py-2 pl-9 pr-3 text-sm text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-foreground-subtle) focus:border-(--color-border-strong)"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-(--color-border) bg-(--color-surface-1) px-3 py-2 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-border-strong)"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showCategories && (
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <CategoryPill
            label={ALL}
            count={decks.length}
            active={category === ALL}
            onClick={() => setCategory(ALL)}
          />
          {categories.map(([name, count]) => (
            <CategoryPill
              key={name}
              label={name}
              count={count}
              active={category === name}
              onClick={() => setCategory(name)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-(--color-foreground-subtle)">
        {visible.length} {visible.length === 1 ? "deck" : "decks"}
      </p>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-(--color-foreground-muted)">
          No decks match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((deck) => (
            <DeckCard key={deck.id} deck={deck} showCategory={showCategories} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-(--color-primary) bg-(--color-primary)/15 text-(--color-primary)"
          : "border-(--color-border) bg-(--color-surface-1) text-(--color-foreground-muted) hover:border-(--color-border-strong)"
      )}
    >
      {label}
      <span className={cn("tabular-nums", active ? "text-(--color-primary)/70" : "text-(--color-foreground-subtle)")}>
        {count}
      </span>
    </button>
  );
}
