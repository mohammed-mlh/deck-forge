"use client";

import { DECK_LIMITS } from "@/types/deck";
import type { DeckValidationIssue } from "@/types/deck";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface DeckStatsBarProps {
  main: number;
  extra: number;
  side: number;
  issues: DeckValidationIssue[];
}

function ZoneStat({
  label,
  count,
  min,
  max,
  hasError,
}: {
  label: string;
  count: number;
  min: number;
  max: number;
  hasError?: boolean;
}) {
  const isWarning = count < min || count > max;

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-(--color-foreground-subtle)">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          hasError || isWarning
            ? count > max
              ? "text-(--color-danger)"
              : "text-(--color-warning)"
            : "text-(--color-foreground)"
        )}
      >
        {count}/{max}
      </span>
    </div>
  );
}

export function DeckStatsBar({ main, extra, side, issues }: DeckStatsBarProps) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const isValid = errors.length === 0 && warnings.length === 0 && main >= DECK_LIMITS.main.min;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-1) p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <ZoneStat
            label="Main Deck"
            count={main}
            min={DECK_LIMITS.main.min}
            max={DECK_LIMITS.main.max}
            hasError={main > DECK_LIMITS.main.max}
          />
          <ZoneStat
            label="Extra Deck"
            count={extra}
            min={DECK_LIMITS.extra.min}
            max={DECK_LIMITS.extra.max}
            hasError={extra > DECK_LIMITS.extra.max}
          />
          <ZoneStat
            label="Side Deck"
            count={side}
            min={DECK_LIMITS.side.min}
            max={DECK_LIMITS.side.max}
            hasError={side > DECK_LIMITS.side.max}
          />
        </div>

        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle2 className="size-4 text-(--color-success)" />
              <span className="text-xs font-medium text-(--color-success)">Valid deck</span>
            </>
          ) : (
            <>
              <AlertTriangle className="size-4 text-(--color-warning)" />
              <span className="text-xs text-(--color-foreground-muted)">
                {errors.length > 0
                  ? `${errors.length} error${errors.length > 1 ? "s" : ""}`
                  : `${warnings.length} warning${warnings.length > 1 ? "s" : ""}`}
              </span>
            </>
          )}
        </div>
      </div>

      {issues.length > 0 && (
        <ul className="flex flex-col gap-1 border-t border-(--color-border) pt-3">
          {issues.slice(0, 4).map((issue, i) => (
            <li
              key={i}
              className={cn(
                "text-xs",
                issue.severity === "error"
                  ? "text-(--color-danger)"
                  : "text-(--color-warning)"
              )}
            >
              {issue.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
