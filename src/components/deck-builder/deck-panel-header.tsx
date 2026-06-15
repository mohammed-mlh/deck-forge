"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Loader2, MoreHorizontal, Save, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeckPanelHeaderProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  saveStatus: "idle" | "saving" | "saved";
  saveError?: string | null;
  onSave: () => void;
  onClear: () => void;
  onImport: () => void;
  onExport: () => void;
}

const menuItemClass =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)";

function DeckActionsMenu({
  onClear,
  onImport,
  onExport,
}: {
  onClear: () => void;
  onImport: () => void;
  onExport: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center justify-center rounded-md border border-(--color-border) bg-(--color-surface-2) p-2 text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3) hover:text-(--color-foreground)"
        aria-label="Deck actions"
        aria-expanded={open}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-(--color-border) bg-(--color-bg-surface) p-1 shadow-md">
          <button type="button" onClick={() => run(onImport)} className={menuItemClass}>
            <Upload className="size-3.5" />
            Import
          </button>
          <button type="button" onClick={() => run(onExport)} className={menuItemClass}>
            <Download className="size-3.5" />
            Export
          </button>
          <div className="my-1 border-t border-(--color-border)" />
          <button
            type="button"
            onClick={() => run(onClear)}
            className={cn(menuItemClass, "text-(--color-danger) hover:text-(--color-danger)")}
          >
            <Trash2 className="size-3.5" />
            Clear deck
          </button>
        </div>
      )}
    </div>
  );
}

export function DeckPanelHeader({
  deckName,
  onDeckNameChange,
  saveStatus,
  saveError,
  onSave,
  onClear,
  onImport,
  onExport,
}: DeckPanelHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-(--color-border) px-3 py-2.5">
      <input
        type="text"
        value={deckName}
        onChange={(e) => onDeckNameChange(e.target.value)}
        placeholder="Deck name"
        className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-(--color-foreground) outline-none transition-colors placeholder:text-(--color-foreground-disabled) focus:border-(--color-border) focus:bg-(--color-surface-2)"
      />

      {saveError ? (
        <span className="hidden max-w-24 shrink-0 truncate text-xs text-(--color-danger) sm:inline">
          {saveError}
        </span>
      ) : null}

      <button
        type="button"
        onClick={onSave}
        disabled={saveStatus === "saving" || saveStatus === "saved"}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors sm:px-3",
          saveStatus === "saved"
            ? "bg-(--color-success)/20 text-(--color-success)"
            : "bg-(--color-primary) text-(--color-primary-foreground) hover:bg-(--color-primary-hover) disabled:opacity-80"
        )}
        title="Save deck"
      >
        {saveStatus === "saving" ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : saveStatus === "saved" ? (
          <Check className="size-3.5" />
        ) : (
          <Save className="size-3.5" />
        )}
        <span>
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Save"}
        </span>
      </button>

      <DeckActionsMenu onClear={onClear} onImport={onImport} onExport={onExport} />
    </div>
  );
}
