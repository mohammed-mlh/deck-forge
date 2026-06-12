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
import { getCardImageUrl } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";
import type { DeckZone } from "@/types/deck";

interface DragDropProviderProps {
  children: React.ReactNode;
  onDropOnZone: (card: YugiohCard, zone: DeckZone) => void;
}

export function DragDropProvider({ children, onDropOnZone }: DragDropProviderProps) {
  const [activeCard, setActiveCard] = useState<YugiohCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = event.active.data.current?.card as YugiohCard | undefined;
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const card = event.active.data.current?.card as YugiohCard | undefined;
    const overData = event.over?.data.current;

    if (!card || overData?.type !== "deck-zone") return;

    const zone = overData.zone as DeckZone;
    onDropOnZone(card, zone);
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
