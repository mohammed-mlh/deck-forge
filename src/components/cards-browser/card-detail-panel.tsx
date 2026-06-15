"use client";

import { X } from "lucide-react";
import { CardDetailContent } from "@/components/cards/card-detail-shared";
import type { YugiohCard } from "@/types/yugioh";
import { cn } from "@/lib/utils";

interface CardDetailPanelProps {
  card: YugiohCard | null;
  onClose: () => void;
  className?: string;
}

export function CardDetailPanel({ card, onClose, className }: CardDetailPanelProps) {
  if (!card) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-(--color-overlay) lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-(--color-border) bg-(--color-bg-surface) shadow-md lg:hidden",
          className
        )}
      >
        <PanelHeader card={card} onClose={onClose} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <CardDetailContent card={card} showName={false} />
        </div>
      </aside>

      <aside
        className={cn(
          "hidden h-full min-h-0 w-80 shrink-0 flex-col overflow-hidden border-l border-(--color-border) bg-(--color-bg-surface) lg:flex xl:w-96",
          className
        )}
      >
        <PanelHeader card={card} onClose={onClose} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <CardDetailContent card={card} showName={false} />
        </div>
      </aside>
    </>
  );
}

function PanelHeader({ card, onClose }: { card: YugiohCard; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-(--color-border) px-3 py-2.5">
      <h2 className="truncate pr-4 text-sm font-semibold leading-snug text-(--color-foreground)">
        {card.name}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
        aria-label="Close panel"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
