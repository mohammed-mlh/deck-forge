"use client";

import { Trash2 } from "lucide-react";
import { DeckPreviewCard } from "@/components/decks/deck-preview-card";
import { entriesToRefs } from "@/features/decks/decks.mapper";
import { getFeaturedCard } from "@/lib/deck-preview";
import { countZone, validateDeckRefs } from "@/lib/deck-rules";
import { DECK_LIMITS, type Deck, type SavedDeck } from "@/types/deck";
import { cn } from "@/lib/utils";

const badgeStyles = {
  success: "bg-(--color-success)/20 text-(--color-success)",
  warning: "bg-(--color-warning)/20 text-(--color-warning)",
  danger: "bg-(--color-danger)/20 text-(--color-danger)",
};

function getDeckStatus(deck: SavedDeck) {
  const main = countZone(deck.main);
  const issues = validateDeckRefs(
    entriesToRefs(deck.main),
    entriesToRefs(deck.extra),
    entriesToRefs(deck.side)
  );
  const hasErrors = issues.some((i) => i.severity === "error");

  if (hasErrors) return { label: "Invalid", tone: "danger" as const };
  if (main >= DECK_LIMITS.main.min) return { label: "Ready", tone: "success" as const };
  return { label: "In progress", tone: "warning" as const };
}

function ZoneCounts({ deck }: { deck: Pick<Deck, "main" | "extra" | "side"> }) {
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);

  return (
    <p className="mt-2 text-sm tabular-nums text-(--color-foreground-muted)">
      Main: {main} Extra: {extra} Side: {side}
    </p>
  );
}

export function PublicDeckCard({ deck }: { deck: SavedDeck }) {
  const featured = getFeaturedCard(deck);

  return (
    <DeckPreviewCard
      href={`/decks/${deck.id}`}
      featured={featured}
      badge={
        <span className="absolute right-3 top-3 rounded bg-(--color-success)/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--color-success)">
          Public
        </span>
      }
    >
      <div className="min-w-0">
        <h3 className="truncate text-lg font-semibold text-(--color-foreground)">{deck.name}</h3>
        <ZoneCounts deck={deck} />
      </div>
    </DeckPreviewCard>
  );
}

export function SavedDeckCard({ deck, onDelete }: { deck: SavedDeck; onDelete: () => void }) {
  const featured = getFeaturedCard(deck);
  const status = getDeckStatus(deck);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${deck.name}"?`)) onDelete();
  };

  return (
    <DeckPreviewCard
      href={`/deck-builder/${deck.id}`}
      featured={featured}
      badge={
        <span
          className={cn(
            "absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            badgeStyles[status.tone]
          )}
        >
          {status.label}
        </span>
      }
      actions={
        <button
          type="button"
          onClick={handleDelete}
          className="absolute left-3 top-3 z-20 rounded-md bg-(--color-surface-1)/80 p-1.5 text-(--color-foreground-subtle) opacity-0 backdrop-blur-sm transition-all hover:text-(--color-danger) group-hover:opacity-100"
          aria-label={`Delete ${deck.name}`}
        >
          <Trash2 className="size-4" />
        </button>
      }
    >
      <div className="min-w-0">
        <h3 className="truncate text-lg font-semibold text-(--color-foreground)">{deck.name}</h3>
        <ZoneCounts deck={deck} />
      </div>
      <p className="text-xs text-(--color-foreground-subtle)">
        Updated: {new Date(deck.updatedAt).toISOString().slice(0, 10)}
      </p>
    </DeckPreviewCard>
  );
}
