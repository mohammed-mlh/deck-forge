"use client";

import { useDroppable } from "@dnd-kit/core";
import { DeckCardItem } from "@/components/deck-builder/deck-card-item";
import type { DeckCardEntry, DeckZone } from "@/types/deck";
import { DECK_LIMITS } from "@/types/deck";
import { cn } from "@/lib/utils";
import type { YugiohCard } from "@/types/yugioh";
import { canAddCardToZone } from "@/lib/deck-rules";
import type { Deck } from "@/types/deck";

const ZONE_LABELS: Record<DeckZone, string> = {
  main: "Main Deck",
  extra: "Extra Deck",
  side: "Side Deck",
};

interface DeckZoneProps {
  zone: DeckZone;
  entries: DeckCardEntry[];
  deck: Deck;
  onRemove: (cardId: number) => void;
  onAdd: (card: YugiohCard) => void;
  className?: string;
}

export function DeckZonePanel({
  zone,
  entries,
  deck,
  onRemove,
  onAdd,
  className,
}: DeckZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zone}`,
    data: { zone, type: "deck-zone" },
  });

  const count = entries.reduce((s, e) => s + e.quantity, 0);
  const max = DECK_LIMITS[zone].max;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-foreground-subtle)]">
          {ZONE_LABELS[zone]}
        </span>
        <span
          className={cn(
            "text-xs tabular-nums",
            count > max
              ? "text-[var(--color-danger)]"
              : "text-[var(--color-foreground-subtle)]"
          )}
        >
          {count}/{max}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-col gap-1.5 rounded-[var(--radius-lg)] border border-dashed p-2 transition-colors",
          isOver
            ? "border-[var(--color-primary)] bg-[var(--color-primary-muted)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
        )}
      >
        {entries.length === 0 ? (
          <p className="py-4 text-center text-xs text-[var(--color-foreground-disabled)]">
            Drop cards here
          </p>
        ) : (
          entries.map((entry) => {
            const canAdd = canAddCardToZone(deck, entry.card, zone).ok;
            return (
              <DeckCardItem
                key={entry.card.id}
                entry={entry}
                zone={zone}
                onRemove={() => onRemove(entry.card.id)}
                onAdd={() => onAdd(entry.card)}
                canAdd={canAdd}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
