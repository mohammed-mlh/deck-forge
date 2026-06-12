"use client";

import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { SavedDeckCard } from "@/components/decks/deck-cards";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { countZone } from "@/lib/deck-rules";

function DeckListSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex h-[168px] overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)"
        >
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-2">
              <div className="h-6 w-2/3 animate-pulse rounded bg-(--color-surface-2)" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-(--color-surface-2)" />
            </div>
            <div className="h-3 w-28 animate-pulse rounded bg-(--color-surface-2)" />
          </div>
          <div className="w-[40%] animate-pulse bg-(--color-surface-2)" />
        </div>
      ))}
    </div>
  );
}

export function MyDecksContent() {
  const { decks, remove, ready } = useSavedDecks();

  const totalCards = decks.reduce(
    (sum, deck) =>
      sum + countZone(deck.main) + countZone(deck.extra) + countZone(deck.side),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Decks"
        description="Open a saved deck to keep building, or start fresh."
      >
        <Link
          href="/deck-builder"
          className="inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
        >
          <Plus className="size-4" />
          New Deck
        </Link>
      </PageHeader>

      {ready && decks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="hover:border-(--color-border) hover:bg-(--color-surface-1)">
            <CardHeader className="gap-4 p-5">
              <CardDescription className="text-sm">Saved Decks</CardDescription>
              <p className="text-2xl font-semibold tabular-nums text-(--color-foreground)">
                {decks.length}
              </p>
            </CardHeader>
          </Card>
          <Card className="hover:border-(--color-border) hover:bg-(--color-surface-1)">
            <CardHeader className="gap-4 p-5">
              <CardDescription className="text-sm">Total Cards</CardDescription>
              <p className="text-2xl font-semibold tabular-nums text-(--color-foreground)">
                {totalCards}
              </p>
            </CardHeader>
          </Card>
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
            href="/deck-builder"
            className="inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
          >
            <Plus className="size-4" />
            Open Builder
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {decks.map((deck) => (
            <SavedDeckCard key={deck.id} deck={deck} onDelete={() => remove(deck.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
