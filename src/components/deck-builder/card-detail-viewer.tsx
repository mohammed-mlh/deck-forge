"use client";

import Link from "next/link";
import { FolderOpen, Search, Upload } from "lucide-react";
import { CardDetailContent } from "@/components/cards/card-detail-shared";
import type { Card } from "@/features/cards/cards.schema";
import { cn } from "@/lib/utils";

const startPromptBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-medium text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3) hover:text-(--color-foreground)";

function DeckBuilderStartPrompt({
  onSearchCards,
  onImportDeck,
}: {
  onSearchCards?: () => void;
  onImportDeck?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h3 className="text-sm font-semibold text-(--color-foreground)">
        Start Building Your Deck
      </h3>

      <div className="flex w-full max-w-[200px] flex-col gap-2">
        {onSearchCards ? (
          <button type="button" onClick={onSearchCards} className={startPromptBtnClass}>
            <Search className="size-3.5" />
            Search Cards
          </button>
        ) : (
          <Link href="/app/cards" className={startPromptBtnClass}>
            <Search className="size-3.5" />
            Search Cards
          </Link>
        )}

        <Link href="/app/decks" className={startPromptBtnClass}>
          <FolderOpen className="size-3.5" />
          Browse Decks
        </Link>

        {onImportDeck ? (
          <button type="button" onClick={onImportDeck} className={startPromptBtnClass}>
            <Upload className="size-3.5" />
            Import Deck
          </button>
        ) : (
          <Link href="/app/deck-builder" className={startPromptBtnClass}>
            <Upload className="size-3.5" />
            Import Deck
          </Link>
        )}
      </div>
    </div>
  );
}

interface CardDetailViewerProps {
  card: Card | null;
  className?: string;
  onSearchCards?: () => void;
  onImportDeck?: () => void;
}

export function CardDetailViewer({
  card,
  className,
  onSearchCards,
  onImportDeck,
}: CardDetailViewerProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >

      {!card ? (
        <DeckBuilderStartPrompt
          onSearchCards={onSearchCards}
          onImportDeck={onImportDeck}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <CardDetailContent card={card} />
        </div>
      )}
    </aside>
  );
}
