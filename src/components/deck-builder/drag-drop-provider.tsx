"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import Image from "next/image";
import { getCardImageUrl } from "@/lib/cards";
import type { Card } from "@/features/cards/cards.schema";
import type { DeckZone } from "@/features/decks/decks.schema";

interface DragDropProviderProps {
  children: React.ReactNode;
  onDropOnZone: (card: Card, zone: DeckZone) => void;
  onMoveCard?: (cardId: number, from: DeckZone, to: DeckZone) => void;
}

export function DragDropProvider({
  children,
  onDropOnZone,
  onMoveCard,
}: DragDropProviderProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as Card | undefined;
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const activeData = event.active.data.current;
    const overData = event.over?.data.current;
    if (!activeData || overData?.type !== "deck-zone") return;

    const zone = overData.zone as DeckZone;

    if (activeData.type === "deck-card") {
      const from = activeData.zone as DeckZone;
      const cardId = activeData.cardId as number;
      if (from !== zone) onMoveCard?.(cardId, from, zone);
      return;
    }

    const card = activeData.card as Card | undefined;
    if (card) onDropOnZone(card, zone);
  };

  const handleDragCancel = () => setActiveCard(null);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
        {activeCard ? (
          <div className="w-24 overflow-hidden rounded-md border border-(--color-primary) bg-(--color-surface-1) shadow-md">
            <Image
              src={getCardImageUrl(activeCard, "small")}
              alt={activeCard.name}
              width={96}
              height={140}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
