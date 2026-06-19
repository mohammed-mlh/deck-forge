"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Coins, Eye, Search, Trophy, User } from "lucide-react";
import { PUBLIC_DECK_SORTS, type PublicDeckSort } from "@/features/public-decks/public-decks.view";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

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

      <div className="absolute letf-3 top-3 px-4">
        {showCategory && (
          <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
            {deck.category}
          </span>
        )}
        {deck.tournamentPlayer && (
          <span className="inline-flex items-center gap-1 rounded bg-orange-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            <Trophy className="size-3" />
            {deck.tournamentPlayer}
          </span>
        )}
      </div>

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
  const [sort, setSort] = useState<PublicDeckSort>("popular");
  const [page, setPage] = useState(1);

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

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-foreground-subtle)" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search decks by name…"
            className="w-full rounded-lg border border-(--color-border) bg-(--color-surface-1) py-2 pl-9 pr-3 text-sm text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-foreground-subtle) focus:border-(--color-border-strong)"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as PublicDeckSort);
            setPage(1);
          }}
          className="rounded-lg border border-(--color-border) bg-(--color-surface-1) px-3 py-2 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-border-strong)"
        >
          {PUBLIC_DECK_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {showCategories && categories.length > 0 && (
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <CategoryPill
            label={ALL}
            count={decks.length}
            active={category === ALL}
            onClick={() => {
              setCategory(ALL);
              setPage(1);
            }}
          />
          {categories.map(([name, count]) => (
            <CategoryPill
              key={name}
              label={name}
              count={count}
              active={category === name}
              onClick={() => {
                setCategory(name);
                setPage(1);
              }}
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
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paged.map((deck) => (
              <DeckCard key={deck.id} deck={deck} showCategory={showCategories} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <PagerButton
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </PagerButton>
              <span className="px-2 text-sm tabular-nums text-(--color-foreground-muted)">
                Page {currentPage} of {pageCount}
              </span>
              <PagerButton
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              >
                <ChevronRight className="size-4" />
              </PagerButton>
            </div>
          )}
        </>
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
      <span
        className={cn(
          "tabular-nums",
          active ? "text-(--color-primary)/70" : "text-(--color-foreground-subtle)"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function PagerButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg border border-(--color-border) bg-(--color-surface-1) p-2 text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
