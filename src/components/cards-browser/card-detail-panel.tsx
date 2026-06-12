"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { getCardImageUrl, getCardTypeLabel } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";
import { cn } from "@/lib/utils";

interface CardDetailPanelProps {
  card: YugiohCard | null;
  onClose: () => void;
  className?: string;
}

export function CardDetailPanel({ card, onClose, className }: CardDetailPanelProps) {
  if (!card) return null;

  const typeLabel = getCardTypeLabel(card);
  const hasStats = card.atk !== undefined || card.def !== undefined;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-(--color-overlay) transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-(--color-border) bg-(--color-bg-surface) shadow-md transition-transform duration-300",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
          <h2 className="truncate pr-4 text-base font-semibold text-(--color-foreground)">
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

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto mb-5 max-w-[240px] overflow-hidden rounded-lg border border-(--color-border)">
            <Image
              src={getCardImageUrl(card, "full")}
              alt={card.name}
              width={240}
              height={350}
              className="h-auto w-full"
              unoptimized
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs text-(--color-foreground-muted)">
              {typeLabel}
            </span>
            {card.attribute && (
              <span className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs text-(--color-foreground-muted)">
                {card.attribute}
              </span>
            )}
            {card.race && (
              <span className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs text-(--color-foreground-muted)">
                {card.race}
              </span>
            )}
            {(card.level !== undefined || card.rank !== undefined) && (
              <span className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs text-(--color-foreground-muted)">
                {card.rank !== undefined ? `Rank ${card.rank}` : `Level ${card.level}`}
              </span>
            )}
            {card.archetype && (
              <span className="rounded-full bg-(--color-primary-muted) px-2.5 py-0.5 text-xs text-(--color-primary)">
                {card.archetype}
              </span>
            )}
          </div>

          {hasStats && (
            <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-1) p-4">
              {card.atk !== undefined && (
                <div>
                  <p className="text-xs text-(--color-foreground-subtle)">ATK</p>
                  <p className="text-lg font-semibold tabular-nums text-(--color-foreground)">
                    {card.atk === -1 ? "?" : card.atk}
                  </p>
                </div>
              )}
              {card.def !== undefined && (
                <div>
                  <p className="text-xs text-(--color-foreground-subtle)">DEF</p>
                  <p className="text-lg font-semibold tabular-nums text-(--color-foreground)">
                    {card.def === -1 ? "?" : card.def}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-(--color-foreground-subtle)">
              Effect
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-(--color-foreground-muted)">
              {card.desc}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
