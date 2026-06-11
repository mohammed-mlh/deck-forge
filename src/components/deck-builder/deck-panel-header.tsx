"use client";

import { Download, Save, Trash2 } from "lucide-react";
import { DECK_LIMITS } from "@/types/deck";
import { cn } from "@/lib/utils";

interface DeckPanelHeaderProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  main: number;
  extra: number;
  side: number;
  saveStatus: "idle" | "saved";
  onSave: () => void;
  onClear: () => void;
  onExport: () => void;
}

function StatPill({
  label,
  count,
  max,
  min,
}: {
  label: string;
  count: number;
  max: number;
  min?: number;
}) {
  const overMax = count > max;
  const underMin = min !== undefined && count < min;

  return (
    <span className="whitespace-nowrap text-sm text-[var(--color-foreground-muted)]">
      {label}{" "}
      <span
        className={cn(
          "font-semibold tabular-nums text-[var(--color-foreground)]",
          overMax && "text-[var(--color-danger)]",
          underMin && "text-[var(--color-warning)]"
        )}
      >
        {count}
      </span>
      <span className="text-[var(--color-foreground-subtle)]">/{max}</span>
    </span>
  );
}

export function DeckPanelHeader({
  deckName,
  onDeckNameChange,
  main,
  extra,
  side,
  saveStatus,
  onSave,
  onClear,
  onExport,
}: DeckPanelHeaderProps) {
  return (
    <div className="grid shrink-0 grid-cols-1 items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
      <input
        type="text"
        value={deckName}
        onChange={(e) => onDeckNameChange(e.target.value)}
        placeholder="Deck name"
        className="min-w-0 rounded-[var(--radius-md)] border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-foreground-disabled)] focus:border-[var(--color-border)] focus:bg-[var(--color-surface-2)] sm:max-w-[180px]"
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-center">
        <StatPill label="Main" count={main} max={DECK_LIMITS.main.max} min={DECK_LIMITS.main.min} />
        <StatPill label="Extra" count={extra} max={DECK_LIMITS.extra.max} />
        <StatPill label="Side" count={side} max={DECK_LIMITS.side.max} />
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        {saveStatus === "saved" && (
          <span className="text-xs text-[var(--color-success)]">Saved</span>
        )}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-xs text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
        >
          <Trash2 className="size-3.5" />
          Clear
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]"
        >
          <Download className="size-3.5" />
          Export .txt
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Save className="size-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}
