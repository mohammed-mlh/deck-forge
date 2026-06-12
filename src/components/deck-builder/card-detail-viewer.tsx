"use client";

import Image from "next/image";
import { Layers } from "lucide-react";
import { getCardImageUrl, getCardTypeLabel } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";
import { cn } from "@/lib/utils";

interface CardDetailViewerProps {
  card: YugiohCard | null;
  className?: string;
}

export function CardDetailViewer({ card, className }: CardDetailViewerProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="shrink-0 border-b border-(--color-border) px-3 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
          Card Details
        </h2>
      </div>

      {!card ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-lg border border-dashed border-(--color-border) bg-(--color-surface-1)">
            <Layers className="size-5 text-(--color-foreground-disabled)" />
          </div>
          <p className="text-sm text-(--color-foreground-muted)">
            Select a card to view details
          </p>
          <p className="text-[11px] text-(--color-foreground-subtle)">
            Click a card in search or your deck
          </p>
        </div>
      ) : (
        <CardDetailContent card={card} />
      )}
    </aside>
  );
}

function CardDetailContent({ card }: { card: YugiohCard }) {
  const typeLabel = getCardTypeLabel(card);
  const hasStats = card.atk !== undefined || card.def !== undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="shrink-0 border-b border-(--color-border) p-3">
        <h3 className="mb-3 text-sm font-semibold leading-snug text-(--color-foreground)">
          {card.name}
        </h3>
        <div className="mx-auto max-w-[200px] overflow-hidden rounded-md border border-(--color-border)">
          <Image
            src={getCardImageUrl(card, "full")}
            alt={card.name}
            width={200}
            height={292}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-1.5">
          <DetailBadge>{typeLabel}</DetailBadge>
          {card.attribute && <DetailBadge>{card.attribute}</DetailBadge>}
          {card.race && <DetailBadge>{card.race}</DetailBadge>}
          {(card.level !== undefined || card.rank !== undefined) && (
            <DetailBadge>
              {card.rank !== undefined ? `Rank ${card.rank}` : `Level ${card.level}`}
            </DetailBadge>
          )}
          {card.archetype && (
            <DetailBadge variant="primary">{card.archetype}</DetailBadge>
          )}
        </div>

        {hasStats && (
          <div className="grid grid-cols-2 gap-2 rounded-md border border-(--color-border) bg-(--color-surface-1) p-3">
            {card.atk !== undefined && (
              <div>
                <p className="text-[10px] uppercase text-(--color-foreground-subtle)">ATK</p>
                <p className="text-base font-semibold tabular-nums text-(--color-foreground)">
                  {card.atk === -1 ? "?" : card.atk}
                </p>
              </div>
            )}
            {card.def !== undefined && (
              <div>
                <p className="text-[10px] uppercase text-(--color-foreground-subtle)">DEF</p>
                <p className="text-base font-semibold tabular-nums text-(--color-foreground)">
                  {card.def === -1 ? "?" : card.def}
                </p>
              </div>
            )}
          </div>
        )}

        <div>
          <h4 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-(--color-foreground-subtle)">
            Effect
          </h4>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-(--color-foreground-muted)">
            {card.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "primary";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px]",
        variant === "primary"
          ? "bg-(--color-primary-muted) text-(--color-primary)"
          : "bg-(--color-surface-2) text-(--color-foreground-muted)"
      )}
    >
      {children}
    </span>
  );
}
