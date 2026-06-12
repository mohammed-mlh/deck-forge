"use client";

import { Minus, Plus } from "lucide-react";
import type { DeckCardEntry, DeckZone } from "@/types/deck";
import { cn } from "@/lib/utils";

interface DeckCardItemProps {
  entry: DeckCardEntry;
  zone: DeckZone;
  onRemove: () => void;
  onAdd?: () => void;
  canAdd?: boolean;
  className?: string;
}

export function DeckCardItem({
  entry,
  onRemove,
  onAdd,
  canAdd,
  className,
}: DeckCardItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-2 py-1.5 transition-colors hover:border-(--color-border-strong)",
        className
      )}
    >
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-(--color-foreground)">
        {entry.card.name}
      </span>
      <span className="shrink-0 rounded bg-(--color-surface-3) px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-(--color-foreground-muted)">
        ×{entry.quantity}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            disabled={!canAdd}
            className="rounded p-0.5 text-(--color-foreground-subtle) transition-colors hover:bg-(--color-surface-3) hover:text-(--color-foreground) disabled:opacity-30"
            aria-label="Add copy"
          >
            <Plus className="size-3" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-0.5 text-(--color-foreground-subtle) transition-colors hover:bg-(--color-surface-3) hover:text-(--color-danger)"
          aria-label="Remove copy"
        >
          <Minus className="size-3" />
        </button>
      </div>
    </div>
  );
}
