"use client";

import { useDroppable } from "@dnd-kit/core";
import { DeckZoneCard } from "@/components/deck-builder/deck-zone-card";
import type { DeckCardEntry, DeckZone } from "@/types/deck";
import { cn } from "@/lib/utils";
import type { YugiohCard } from "@/types/yugioh";
import type { Deck } from "@/types/deck";

const ZONE_META: Record<DeckZone, { label: string; hint: string }> = {
  main: { label: "Main Deck", hint: "40–60 cards" },
  extra: {
    label: "Extra Deck",
    hint: "Fusion · Synchro · XYZ · Link · up to 15",
  },
  side: { label: "Side Deck", hint: "Up to 15 cards" },
};

type ZoneLayout = "expanded" | "strip";

interface DeckZoneProps {
  zone: DeckZone;
  entries: DeckCardEntry[];
  deck: Deck;
  onRemove: (cardId: number) => void;
  onAdd: (card: YugiohCard) => void;
  layout?: ZoneLayout;
  className?: string;
}

export function DeckZonePanel({
  zone,
  entries,
  onRemove,
  layout = "expanded",
  className,
}: DeckZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zone}`,
    data: { zone, type: "deck-zone" },
  });

  const count = entries.reduce((s, e) => s + e.quantity, 0);
  const meta = ZONE_META[zone];
  const isStrip = layout === "strip";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col gap-1.5",
        layout === "expanded" && "min-h-0 flex-1",
        className
      )}
    >
      <div className="flex shrink-0 items-baseline justify-between gap-2 px-0.5">
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
          {meta.label}{" "}
          <span className="font-normal text-[var(--color-foreground-muted)]">
            ({count})
          </span>
        </h3>
        <span className="text-[11px] text-[var(--color-foreground-subtle)]">
          {meta.hint}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "rounded-[var(--radius-lg)] border p-2 transition-colors",
          isStrip ? "shrink-0" : "min-h-0 flex-1 overflow-y-auto",
          isOver
            ? "border-[var(--color-primary)] bg-[var(--color-primary-muted)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
          entries.length === 0 && "border-dashed"
        )}
      >
        {entries.length === 0 ? (
          <p
            className={cn(
              "flex items-center justify-center text-xs text-[var(--color-foreground-disabled)]",
              isStrip ? "h-20" : "min-h-[120px]"
            )}
          >
            Drop cards here
          </p>
        ) : (
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 xl:grid-cols-12">
            {entries.map((entry) => (
              <DeckZoneCard
                key={entry.card.id}
                entry={entry}
                onRemove={() => onRemove(entry.card.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
