"use client";

import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { DeckListCard } from "@/components/my-decks/deck-list-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { countZone } from "@/lib/deck-rules";

function DeckListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)]"
        >
          <div className="h-[76px] animate-pulse bg-[var(--color-surface-2)]" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--color-surface-2)]" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" />
              <div className="h-6 w-16 animate-pulse rounded bg-[var(--color-surface-2)]" />
              <div className="h-6 w-14 animate-pulse rounded bg-[var(--color-surface-2)]" />
            </div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-2)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyDecksView() {
  const { decks, remove, ready } = useSavedDecks();

  const totalCards = decks.reduce(
    (sum, deck) =>
      sum + countZone(deck.main) + countZone(deck.extra) + countZone(deck.side),
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        title="My Decks"
        description="Open a saved deck to keep building, or start fresh."
      >
        <Link
          href="/app/builder"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="size-4" />
          New Deck
        </Link>
      </PageHeader>

      {ready && decks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Saved Decks" value={String(decks.length)} trend="neutral" />
          <StatCard label="Total Cards" value={String(totalCards)} trend="neutral" />
        </div>
      )}

      {!ready ? (
        <DeckListSkeleton />
      ) : decks.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-5" />}
          title="No decks yet"
          description="Build your first deck in the builder, then save it here."
          className="py-24"
        >
          <Link
            href="/app/builder"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Plus className="size-4" />
            Open Builder
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {decks.map((deck) => (
            <DeckListCard key={deck.id} deck={deck} onDelete={() => remove(deck.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
