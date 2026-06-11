"use client";

import { cn } from "@/lib/utils";

interface DeckEmptySlotProps {
  index: number;
  className?: string;
}

export function DeckEmptySlot({ index, className }: DeckEmptySlotProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[59/86] w-full items-center justify-center rounded-[2px] border border-[var(--color-border)] bg-[var(--color-bg-base)]",
        className
      )}
      aria-hidden
    >
      <span className="text-[10px] font-medium tabular-nums text-[var(--color-foreground-disabled)]">
        {index}
      </span>
    </div>
  );
}
