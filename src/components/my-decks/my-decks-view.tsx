"use client";

import Link from "next/link";
import { FolderOpen, Hammer, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { countZone } from "@/lib/deck-rules";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MyDecksView() {
  const { decks, remove, ready } = useSavedDecks();

  if (!ready) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="My Decks" description="Manage and organize your saved decks." />
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-surface-2)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Decks" description="Manage and organize your saved decks.">
        <Link
          href="/app/builder"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="size-4" />
          New Deck
        </Link>
      </PageHeader>

      {decks.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-5" />}
          title="No decks yet"
          description="Create your first deck to get started."
          className="py-32"
        >
          <Link
            href="/app/builder"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            <Plus className="size-4" />
            Build a Deck
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const total =
              countZone(deck.main) + countZone(deck.extra) + countZone(deck.side);

            return (
              <div
                key={deck.id}
                className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                      {deck.name}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
                      {total} cards · Updated {formatDate(deck.updatedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(deck.id)}
                    className="shrink-0 rounded-[var(--radius-md)] p-1.5 text-[var(--color-foreground-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger)]"
                    aria-label={`Delete ${deck.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <Link
                  href={`/app/builder?id=${deck.id}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]"
                >
                  <Hammer className="size-4" />
                  Edit Deck
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
