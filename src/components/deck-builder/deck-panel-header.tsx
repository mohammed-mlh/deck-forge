"use client";

import { Download, Save, Trash2, Upload } from "lucide-react";
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
  onImport: () => void;
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
    <span className="whitespace-nowrap text-sm text-(--color-foreground-muted)">
      {label}{" "}
      <span
        className={cn(
          "font-semibold tabular-nums text-(--color-foreground)",
          overMax && "text-(--color-danger)",
          underMin && "text-(--color-warning)"
        )}
      >
        {count}
      </span>
      <span className="text-(--color-foreground-subtle)">/{max}</span>
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
  onImport,
  onExport,
}: DeckPanelHeaderProps) {
  return (
    <div className="grid shrink-0 grid-cols-1 items-center gap-2 border-b border-(--color-border) px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
      <input
        type="text"
        value={deckName}
        onChange={(e) => onDeckNameChange(e.target.value)}
        placeholder="Deck name"
        className="min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-foreground-disabled) focus:border-(--color-border) focus:bg-(--color-surface-2) sm:max-w-[180px]"
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-center">
        <StatPill label="Main" count={main} max={DECK_LIMITS.main.max} min={DECK_LIMITS.main.min} />
        <StatPill label="Extra" count={extra} max={DECK_LIMITS.extra.max} />
        <StatPill label="Side" count={side} max={DECK_LIMITS.side.max} />
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        {saveStatus === "saved" && (
          <span className="text-xs text-(--color-success)">Saved</span>
        )}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-transparent px-3 py-1.5 text-xs text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)"
        >
          <Trash2 className="size-3.5" />
          Clear
        </button>
        <button
          type="button"
          onClick={onImport}
          className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
        >
          <Upload className="size-3.5" />
          Import
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
        >
          <Download className="size-3.5" />
          Export
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-md bg-(--color-primary) px-3 py-1.5 text-xs font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
        >
          <Save className="size-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}
