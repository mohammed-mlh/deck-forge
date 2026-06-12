"use client";

import { useId } from "react";
import { useArchetypes } from "@/hooks/use-archetypes";
import {
  DEFAULT_CARD_FILTERS,
  type CardFilters,
  type CardSort,
} from "@/lib/card-filters";
import { CARD_ATTRIBUTES, type CardTypeFilter } from "@/types/yugioh";
import { cn } from "@/lib/utils";

const TYPES: { value: CardTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "monster", label: "Monster" },
  { value: "spell", label: "Spell" },
  { value: "trap", label: "Trap" },
];

const selectClass =
  "h-8 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-2 text-sm text-(--color-foreground) outline-none focus:border-(--color-border-focus)";

interface CardFiltersPanelProps {
  filters: CardFilters;
  onChange: (filters: CardFilters) => void;
  className?: string;
  compact?: boolean;
}

export function CardFiltersPanel({
  filters,
  onChange,
  className,
  compact,
}: CardFiltersPanelProps) {
  const archetypeListId = useId();
  const archetypes = useArchetypes();

  const patch = (partial: Partial<CardFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const showMonsterExtras = filters.type === "all" || filters.type === "monster";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-1">
        {TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => patch({ type: opt.value })}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              filters.type === opt.value
                ? "border-(--color-primary) bg-(--color-primary-muted) text-(--color-primary)"
                : "border-(--color-border) bg-(--color-surface-2) text-(--color-foreground-muted)"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1")}>
        <select
          value={filters.attribute ?? ""}
          onChange={(e) => patch({ attribute: e.target.value || undefined })}
          className={selectClass}
          aria-label="Attribute"
        >
          <option value="">Any attribute</option>
          {CARD_ATTRIBUTES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <input
          type="text"
          list={archetypeListId}
          value={filters.archetype ?? ""}
          onChange={(e) => patch({ archetype: e.target.value || undefined })}
          placeholder="Archetype"
          className={cn(selectClass, "placeholder:text-(--color-foreground-disabled)")}
        />
        <datalist id={archetypeListId}>
          {archetypes.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
      </div>

      {!compact && showMonsterExtras && (
        <>
          <RangeInputs
            label="Level"
            min={filters.levelMin}
            max={filters.levelMax}
            bounds={[0, 13]}
            onChange={(levelMin, levelMax) => patch({ levelMin, levelMax })}
          />
          <RangeInputs
            label="ATK"
            min={filters.atkMin}
            max={filters.atkMax}
            bounds={[0, 5000]}
            step={100}
            onChange={(atkMin, atkMax) => patch({ atkMin, atkMax })}
          />
        </>
      )}

      {!compact && (
        <select
          value={filters.sort}
          onChange={(e) => patch({ sort: e.target.value as CardSort })}
          className={selectClass}
          aria-label="Sort"
        >
          <option value="name">Name (A–Z)</option>
          <option value="atk-desc">ATK (high → low)</option>
          <option value="level-desc">Level (high → low)</option>
        </select>
      )}

      {!compact && (
        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_CARD_FILTERS })}
          className="text-left text-xs text-(--color-foreground-muted) hover:text-(--color-foreground)"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

function RangeInputs({
  label,
  min,
  max,
  bounds,
  step = 1,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  bounds: [number, number];
  step?: number;
  onChange: (min: number, max: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-(--color-foreground-muted)">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min={bounds[0]}
          max={bounds[1]}
          step={step}
          value={min}
          onChange={(e) => onChange(Number(e.target.value), max)}
          className={selectClass}
          aria-label={`${label} min`}
        />
        <input
          type="number"
          min={bounds[0]}
          max={bounds[1]}
          step={step}
          value={max}
          onChange={(e) => onChange(min, Number(e.target.value))}
          className={selectClass}
          aria-label={`${label} max`}
        />
      </div>
    </div>
  );
}

export { DEFAULT_CARD_FILTERS };
