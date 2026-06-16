"use client";

import { useDroppable } from "@dnd-kit/core";
import { DeckZoneCard } from "@/components/deck-builder/deck-zone-card";
import {
  buildSlotGrid,
  DECK_GRID_COLUMNS,
  entriesToSlots,
  type DeckSlot,
} from "@/lib/deck-slots";
import type { DeckCardEntry, DeckZone } from "@/features/decks/decks.schema";
import { DECK_LIMITS } from "@/features/decks/decks.schema";
import { cn } from "@/lib/utils";
import type { Card } from "@/features/cards/cards.schema";
import type { Deck } from "@/features/decks/decks.schema";

const ZONE_META: Record<DeckZone, { label: string }> = {
  main: { label: "Main" },
  extra: { label: "Extra" },
  side: { label: "Side" },
};

interface DeckZoneProps {
  zone: DeckZone;
  entries: DeckCardEntry[];
  deck: Deck;
  onRemove: (cardId: number) => void;
  onAdd: (card: Card) => void;
  onSelectCard?: (card: Card) => void;
  selectedCardId?: number | null;
  className?: string;
}

export function DeckZonePanel({
  zone,
  entries,
  onRemove,
  onSelectCard,
  selectedCardId,
  className,
}: DeckZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zone}`,
    data: { zone, type: "deck-zone" },
  });

  const count = entries.reduce((s, e) => s + e.quantity, 0);
  const capacity = DECK_LIMITS[zone].max;
  const slots = buildSlotGrid(entriesToSlots(entries), capacity);
  const meta = ZONE_META[zone];

  return (
    <div className={cn("flex shrink-0 flex-col", className)}>
      <div className="flex shrink-0 items-center justify-between border-b border-(--color-border) bg-(--color-surface-2) px-3 py-1.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-(--color-foreground)">
          {meta.label}{" "}
          <span className="text-(--color-foreground-muted)">[{count}]</span>
        </h3>
        <span className="text-[10px] tabular-nums text-(--color-foreground-subtle)">
          {count}/{capacity}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "p-1.5 transition-colors",
          isOver && "bg-(--color-primary-muted)"
        )}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${DECK_GRID_COLUMNS}, minmax(0, 1fr))`,
          }}
        >
          {slots.map((slot, index) => (
            <SlotCell
              key={slot ? `${slot.entry.card.id}-${slot.copyIndex}` : `empty-${index}`}
              slot={slot}
              zone={zone}
              slotNumber={index + 1}
              onRemove={onRemove}
              onSelectCard={onSelectCard}
              selectedCardId={selectedCardId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeckEmptySlot({ index }: { index: number }) {
  return (
    <div
      className="relative flex aspect-[59/86] w-full items-center justify-center rounded-[2px] border border-(--color-border) bg-(--color-bg-base)"
      aria-hidden
    >
      <span className="text-[10px] font-medium tabular-nums text-(--color-foreground-disabled)">
        {index}
      </span>
    </div>
  );
}

function SlotCell({
  slot,
  zone,
  slotNumber,
  onRemove,
  onSelectCard,
  selectedCardId,
}: {
  slot: DeckSlot | null;
  zone: DeckZone;
  slotNumber: number;
  onRemove: (cardId: number) => void;
  onSelectCard?: (card: Card) => void;
  selectedCardId?: number | null;
}) {
  if (!slot) {
    return <DeckEmptySlot index={slotNumber} />;
  }

  return (
    <DeckZoneCard
      card={slot.entry.card}
      zone={zone}
      onSelect={onSelectCard}
      selected={selectedCardId === slot.entry.card.id}
      onRemove={() => onRemove(slot.entry.card.id)}
    />
  );
}
