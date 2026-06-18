"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Coins, Eye, Search, Trophy, User } from "lucide-react";
import { PUBLIC_DECK_SORTS, type PublicDeckSort } from "@/features/public-decks/public-decks.view";
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

export interface PublicDeckCategoryOption {
  name: string;
  count: number;
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
  total,
  page,
  pageCount,
  query,
  sort,
  category,
  categories = [],
  basePath,
  showCategories = true,
}: {
  decks: PublicDeckListItem[];
  total: number;
  page: number;
  pageCount: number;
  query: string;
  sort: PublicDeckSort;
  category: string;
  categories?: PublicDeckCategoryOption[];
  basePath: string;
  showCategories?: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState(query);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = (next: {
    q?: string;
    sort?: PublicDeckSort;
    category?: string;
    page?: number;
  }) => {
    const q = (next.q ?? query).trim();
    const s = next.sort ?? sort;
    const c = next.category ?? category;
    const p = next.page ?? 1;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s !== "popular") params.set("sort", s);
    if (c && c !== ALL) params.set("category", c);
    if (p > 1) params.set("page", String(p));

    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const onSearch = (value: string) => {
    setText(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => navigate({ q: value }), 350);
  };

  const allCount = categories.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-foreground-subtle)" />
          <input
            type="search"
            value={text}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search decks by name…"
            className="w-full rounded-lg border border-(--color-border) bg-(--color-surface-1) py-2 pl-9 pr-3 text-sm text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-foreground-subtle) focus:border-(--color-border-strong)"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => navigate({ sort: e.target.value as PublicDeckSort })}
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
            count={allCount}
            active={category === ALL}
            onClick={() => navigate({ category: ALL })}
          />
          {categories.map((item) => (
            <CategoryPill
              key={item.name}
              label={item.name}
              count={item.count}
              active={category === item.name}
              onClick={() => navigate({ category: item.name })}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-(--color-foreground-subtle)">
        {total} {total === 1 ? "deck" : "decks"}
      </p>

      {decks.length === 0 ? (
        <p className="py-16 text-center text-sm text-(--color-foreground-muted)">
          No decks match your filters.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} showCategory={showCategories} />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <PagerButton disabled={page <= 1} onClick={() => navigate({ page: page - 1 })}>
                <ChevronLeft className="size-4" />
              </PagerButton>
              <span className="px-2 text-sm tabular-nums text-(--color-foreground-muted)">
                Page {page} of {pageCount}
              </span>
              <PagerButton
                disabled={page >= pageCount}
                onClick={() => navigate({ page: page + 1 })}
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
