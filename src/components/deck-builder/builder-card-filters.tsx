"use client";

import { useId } from "react";
import { useArchetypes } from "@/hooks/use-archetypes";
import { cn } from "@/lib/utils";
import {
  CARD_ATTRIBUTES,
  CARD_LEVELS,
  type CardSearchParams,
  type CardTypeFilter,
} from "@/types/yugioh";

const TYPE_OPTIONS: { value: CardTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "monster", label: "Monster" },
  { value: "spell", label: "Spell" },
  { value: "trap", label: "Trap" },
];

interface BuilderCardFiltersProps {
  filters: CardSearchParams;
  onChange: (partial: Partial<CardSearchParams>) => void;
  className?: string;
}

const selectClass =
  "h-8 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 text-xs text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-focus)]";

export function BuilderCardFilters({
  filters,
  onChange,
  className,
}: BuilderCardFiltersProps) {
  const archetypeListId = useId();
  const archetypes = useArchetypes();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ type: opt.value })}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
              (filters.type ?? "all") === opt.value
                ? "border-[var(--color-primary)] bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-foreground-muted)] hover:border-[var(--color-border-strong)]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <select
          value={filters.attribute ?? ""}
          onChange={(e) => onChange({ attribute: e.target.value || undefined })}
          className={selectClass}
          aria-label="Attribute"
        >
          <option value="">Attribute</option>
          {CARD_ATTRIBUTES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={filters.level ?? ""}
          onChange={(e) => onChange({ level: e.target.value || undefined })}
          className={selectClass}
          aria-label="Level"
        >
          <option value="">Level</option>
          {CARD_LEVELS.map((l) => (
            <option key={l} value={l}>
              Lv {l}
            </option>
          ))}
        </select>

        <input
          type="text"
          list={archetypeListId}
          value={filters.archetype ?? ""}
          onChange={(e) => onChange({ archetype: e.target.value || undefined })}
          placeholder="Archetype"
          className={cn(selectClass, "placeholder:text-[var(--color-foreground-disabled)]")}
        />
        <datalist id={archetypeListId}>
          {archetypes.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
