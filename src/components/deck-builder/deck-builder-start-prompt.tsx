"use client";

import Link from "next/link";
import { FolderOpen, Search, Upload } from "lucide-react";

interface DeckBuilderStartPromptProps {
  onSearchCards?: () => void;
  onImportDeck?: () => void;
}

const btnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-medium text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3) hover:text-(--color-foreground)";

export function DeckBuilderStartPrompt({
  onSearchCards,
  onImportDeck,
}: DeckBuilderStartPromptProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h3 className="text-sm font-semibold text-(--color-foreground)">
        Start Building Your Deck
      </h3>

      <div className="flex w-full max-w-[200px] flex-col gap-2">
        {onSearchCards ? (
          <button type="button" onClick={onSearchCards} className={btnClass}>
            <Search className="size-3.5" />
            Search Cards
          </button>
        ) : (
          <Link href="/cards" className={btnClass}>
            <Search className="size-3.5" />
            Search Cards
          </Link>
        )}

        <Link href="/browse-decks" className={btnClass}>
          <FolderOpen className="size-3.5" />
          Browse Decks
        </Link>

        {onImportDeck ? (
          <button type="button" onClick={onImportDeck} className={btnClass}>
            <Upload className="size-3.5" />
            Import Deck
          </button>
        ) : (
          <Link href="/deck-builder" className={btnClass}>
            <Upload className="size-3.5" />
            Import Deck
          </Link>
        )}
      </div>
    </div>
  );
}
