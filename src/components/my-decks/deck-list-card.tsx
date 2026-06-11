"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Layers, Trash2 } from "lucide-react";
import { getCardImageUrl } from "@/lib/ygoprodeck";
import { countZone, validateDeck } from "@/lib/deck-rules";
import { DECK_LIMITS, type SavedDeck } from "@/types/deck";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 6;

function getPreviewEntries(deck: SavedDeck) {
  const combined = [...deck.main, ...deck.extra, ...deck.side];
  return combined.slice(0, PREVIEW_COUNT);
}

function getDeckStatus(deck: SavedDeck) {
  const main = countZone(deck.main);
  const issues = validateDeck(deck);
  const hasErrors = issues.some((i) => i.severity === "error");

  if (hasErrors) return { label: "Invalid", tone: "danger" as const };
  if (main >= DECK_LIMITS.main.min) return { label: "Ready", tone: "success" as const };
  return { label: "In progress", tone: "warning" as const };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const toneStyles = {
  success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
};

interface DeckListCardProps {
  deck: SavedDeck;
  onDelete: () => void;
}

export function DeckListCard({ deck, onDelete }: DeckListCardProps) {
  const main = countZone(deck.main);
  const extra = countZone(deck.extra);
  const side = countZone(deck.side);
  const total = main + extra + side;
  const preview = getPreviewEntries(deck);
  const remaining = Math.max(0, deck.main.length + deck.extra.length + deck.side.length - PREVIEW_COUNT);
  const status = getDeckStatus(deck);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${deck.name}"?`)) onDelete();
  };

  return (
    <Link
      href={`/app/builder?id=${deck.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
    >
      <div className="relative border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-3">
        {preview.length > 0 ? (
          <div className="flex items-end gap-1">
            {preview.map((entry) => (
              <div
                key={`${entry.card.id}-${entry.quantity}`}
                className="relative aspect-[59/86] w-10 shrink-0 overflow-hidden rounded-[2px] sm:w-11"
              >
                <Image
                  src={getCardImageUrl(entry.card, "small")}
                  alt={entry.card.name}
                  fill
                  sizes="44px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
            {remaining > 0 && (
              <span className="mb-1 ml-1 text-xs font-medium text-[var(--color-foreground-subtle)]">
                +{remaining}
              </span>
            )}
          </div>
        ) : (
          <div className="flex h-[52px] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)]">
            <Layers className="size-4 text-[var(--color-foreground-disabled)]" />
          </div>
        )}

        <button
          type="button"
          onClick={handleDelete}
          className="absolute right-2 top-2 rounded-[var(--radius-md)] p-1.5 text-[var(--color-foreground-subtle)] opacity-0 transition-all hover:bg-[var(--color-surface-3)] hover:text-[var(--color-danger)] group-hover:opacity-100"
          aria-label={`Delete ${deck.name}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-base font-semibold text-[var(--color-foreground)]">
            {deck.name}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              toneStyles[status.tone]
            )}
          >
            {status.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <ZonePill label="Main" count={main} max={DECK_LIMITS.main.max} />
          <ZonePill label="Extra" count={extra} max={DECK_LIMITS.extra.max} />
          <ZonePill label="Side" count={side} max={DECK_LIMITS.side.max} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-[var(--color-foreground-muted)]">
          <span className="tabular-nums">{total} cards</span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(deck.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ZonePill({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  const over = count > max;

  return (
    <span
      className={cn(
        "rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] px-2 py-1 text-[11px] tabular-nums",
        over ? "text-[var(--color-danger)]" : "text-[var(--color-foreground-muted)]"
      )}
    >
      {label}{" "}
      <span className="font-medium text-[var(--color-foreground)]">{count}</span>/{max}
    </span>
  );
}
