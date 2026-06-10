"use client";

import { RotateCcw } from "lucide-react";
import { DragDropProvider } from "@/components/deck-builder/drag-drop-provider";
import { CardSearchPanel } from "@/components/deck-builder/card-search-panel";
import { DeckZonePanel } from "@/components/deck-builder/deck-zone";
import { DeckStatsBar } from "@/components/deck-builder/deck-stats-bar";
import { useDeck } from "@/hooks/use-deck";
import { getDefaultZoneForCard } from "@/lib/deck-rules";
import type { DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

export function DeckBuilder() {
  const { deck, stats, issues, addCard, removeCard, resetDeck, setDeckName } = useDeck();

  const handleDrop = (card: YugiohCard, zone: DeckZone) => {
    addCard(card, zone);
  };

  const handleAdd = (card: YugiohCard, zone?: DeckZone) => {
    addCard(card, zone ?? getDefaultZoneForCard(card));
  };

  return (
    <DragDropProvider onDropOnZone={handleDrop}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            value={deck.name}
            onChange={(e) => setDeckName(e.target.value)}
            className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-lg font-semibold text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-focus)] sm:max-w-xs"
          />
          <button
            type="button"
            onClick={resetDeck}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>

        <DeckStatsBar
          main={stats.main}
          extra={stats.extra}
          side={stats.side}
          issues={issues}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="flex min-h-[400px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 lg:min-h-0">
            <h2 className="mb-3 shrink-0 text-sm font-semibold text-[var(--color-foreground)]">
              Card Search
            </h2>
            <CardSearchPanel onAddCard={handleAdd} />
          </div>

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
            <h2 className="text-sm font-semibold text-[var(--color-foreground)]">Your Deck</h2>
            <DeckZonePanel
              zone="main"
              entries={deck.main}
              deck={deck}
              onRemove={(id) => removeCard(id, "main")}
              onAdd={(card) => handleAdd(card, "main")}
            />
            <DeckZonePanel
              zone="extra"
              entries={deck.extra}
              deck={deck}
              onRemove={(id) => removeCard(id, "extra")}
              onAdd={(card) => handleAdd(card, "extra")}
            />
            <DeckZonePanel
              zone="side"
              entries={deck.side}
              deck={deck}
              onRemove={(id) => removeCard(id, "side")}
              onAdd={(card) => handleAdd(card, "side")}
            />
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
}
