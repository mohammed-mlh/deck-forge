import Image from "next/image";
import { getCardImageUrl, getCardTypeLabel } from "@/lib/ygoprodeck";
import type { YugiohCard } from "@/types/yugioh";
import { cn } from "@/lib/utils";

function formatStatValue(value: number): string {
  return value === -1 ? "?" : value.toLocaleString();
}

export function DetailBadge({
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

function StatCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "atk" | "def";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-3.5 py-2.5",
        tone === "atk"
          ? "bg-linear-to-br from-(--color-danger)/10 via-(--color-surface-1) to-(--color-surface-1)"
          : "bg-linear-to-br from-(--color-secondary)/10 via-(--color-surface-1) to-(--color-surface-1)"
      )}
    >
      <span
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.18em]",
          tone === "atk" ? "text-(--color-danger)" : "text-(--color-secondary)"
        )}
      >
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums leading-none text-(--color-foreground)">
        {formatStatValue(value)}
      </span>
    </div>
  );
}

export function MonsterStats({ atk, def }: { atk?: number; def?: number }) {
  const hasAtk = atk !== undefined;
  const hasDef = def !== undefined;

  if (!hasAtk && !hasDef) return null;

  if (hasAtk && hasDef) {
    return (
      <div className="overflow-hidden rounded-lg border border-(--color-border)">
        <div className="grid grid-cols-2 divide-x divide-(--color-border)">
          <StatCell label="ATK" value={atk!} tone="atk" />
          <StatCell label="DEF" value={def!} tone="def" />
        </div>
      </div>
    );
  }

  const label = hasAtk ? "ATK" : "DEF";
  const value = hasAtk ? atk! : def!;
  const tone = hasAtk ? "atk" : "def";

  return (
    <div className="overflow-hidden rounded-lg border border-(--color-border)">
      <StatCell label={label} value={value} tone={tone} />
    </div>
  );
}

export function CardDetailBody({ card, className }: { card: YugiohCard; className?: string }) {
  const typeLabel = getCardTypeLabel(card);
  const hasStats = card.atk !== undefined || card.def !== undefined;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-1.5">
        <DetailBadge>{typeLabel}</DetailBadge>
        {card.attribute && <DetailBadge>{card.attribute}</DetailBadge>}
        {card.race && <DetailBadge>{card.race}</DetailBadge>}
        {(card.level !== undefined || card.rank !== undefined) && (
          <DetailBadge>
            {card.rank !== undefined ? `Rank ${card.rank}` : `Level ${card.level}`}
          </DetailBadge>
        )}
        {card.archetype && <DetailBadge variant="primary">{card.archetype}</DetailBadge>}
      </div>

      {hasStats && <MonsterStats atk={card.atk} def={card.def} />}

      <div>
        <h4 className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-(--color-foreground-subtle)">
          Effect
        </h4>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-(--color-foreground-muted)">
          {card.desc}
        </p>
      </div>
    </div>
  );
}

export function CardDetailContent({
  card,
  showName = true,
}: {
  card: YugiohCard;
  showName?: boolean;
}) {
  return (
    <>
      <div className="shrink-0 border-b border-(--color-border) p-3">
        {showName && (
          <h3 className="mb-3 text-sm font-semibold leading-snug text-(--color-foreground)">
            {card.name}
          </h3>
        )}
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
      <CardDetailBody card={card} className="p-3" />
    </>
  );
}
