"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, Trash2 } from "lucide-react";
import { getMostPowerfulMonster, getCardArtUrl } from "@/lib/deck-preview";
import { countZone, validateDeck } from "@/lib/deck-rules";
import { DECK_LIMITS, type SavedDeck } from "@/types/deck";
import { cn } from "@/lib/utils";

function getDeckStatus(deck: SavedDeck) {
  const main = countZone(deck.main);
  const issues = validateDeck(deck);
  const hasErrors = issues.some((i) => i.severity === "error");

  if (hasErrors) return { label: "Invalid", tone: "danger" as const };
  if (main >= DECK_LIMITS.main.min) return { label: "Ready", tone: "success" as const };
  return { label: "In progress", tone: "warning" as const };
}

function formatUpdated(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

const badgeStyles = {
  success: "bg-[var(--color-success)]/20 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/20 text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]/20 text-[var(--color-danger)]",
};

interface DeckListCardProps {
  deck: SavedDeck;
  onDelete: () => void;
}

export function DeckListCard({ deck, onDelete }: DeckListCardProps) {
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const featured = getMostPowerfulMonster(deck);
  const status = getDeckStatus(deck);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${deck.name}"?`)) onDelete();
  };

  return (
    <Link
      href={`/deck-builder/${deck.id}`}
      className="group relative flex h-[168px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-4 pr-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[var(--color-foreground)]">
            {deck.name}
          </h3>
          <p className="mt-2 text-sm tabular-nums text-[var(--color-foreground-muted)]">
            Main: {main} Extra: {extra} Side: {side}
          </p>
        </div>

        <p className="text-xs text-[var(--color-foreground-subtle)]">
          Updated: {formatUpdated(deck.updatedAt)}
        </p>
      </div>

      <div className="relative h-full w-[44%] shrink-0 sm:w-[40%]">
        {featured ? (
          <>
            <Image
              src={getCardArtUrl(featured)}
              alt={featured.name}
              fill
              sizes="(max-width: 640px) 44vw, 280px"
              className="object-cover object-[center_20%]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-1)] via-[var(--color-surface-1)]/70 to-transparent transition-colors group-hover:from-[var(--color-surface-2)] group-hover:via-[var(--color-surface-2)]/70" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--color-bg-elevated)]">
            <Layers className="size-8 text-[var(--color-foreground-disabled)]" />
          </div>
        )}

        <span
          className={cn(
            "absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            badgeStyles[status.tone]
          )}
        >
          {status.label}
        </span>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="absolute left-3 top-3 z-20 rounded-[var(--radius-md)] bg-[var(--color-surface-1)]/80 p-1.5 text-[var(--color-foreground-subtle)] opacity-0 backdrop-blur-sm transition-all hover:text-[var(--color-danger)] group-hover:opacity-100"
        aria-label={`Delete ${deck.name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </Link>
  );
}
