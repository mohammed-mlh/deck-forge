"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useArchetypes } from "@/hooks/use-archetypes";
import {
  CARD_ATTRIBUTES,
  CARD_LEVELS,
  type CardSearchParams,
  type CardTypeFilter,
} from "@/types/yugioh";

interface FilterSidebarProps {
  filters: CardSearchParams;
  onChange: (filters: Partial<CardSearchParams>) => void;
  className?: string;
  compact?: boolean;
}

const TYPE_OPTIONS: { value: CardTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "monster", label: "Monster" },
  { value: "spell", label: "Spell" },
  { value: "trap", label: "Trap" },
];

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--color-foreground-muted)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none transition-colors focus:border-[var(--color-border-focus)]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
  className,
  compact,
}: FilterSidebarProps) {
  const archetypeListId = useId();
  const archetypes = useArchetypes();

  return (
    <div
      className={cn(
        "flex h-fit flex-col gap-4 self-start rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4",
        className
      )}
    >
      {!compact && (
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Filters</h3>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-foreground-muted)]">Type</span>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ type: opt.value })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                (filters.type ?? "all") === opt.value
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-foreground-muted)] hover:border-[var(--color-border-strong)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Attribute"
        value={filters.attribute ?? ""}
        onChange={(v) => onChange({ attribute: v || undefined })}
        placeholder="Any attribute"
        options={CARD_ATTRIBUTES.map((a) => ({ value: a, label: a }))}
      />

      <SelectField
        label="Level / Rank"
        value={filters.level ?? ""}
        onChange={(v) => onChange({ level: v || undefined })}
        placeholder="Any level"
        options={CARD_LEVELS.map((l) => ({ value: l, label: `Level ${l}` }))}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${archetypeListId}-input`}
          className="text-xs font-medium text-[var(--color-foreground-muted)]"
        >
          Archetype
        </label>
        <input
          id={`${archetypeListId}-input`}
          type="text"
          list={archetypeListId}
          value={filters.archetype ?? ""}
          onChange={(e) => onChange({ archetype: e.target.value || undefined })}
          placeholder="e.g. Snake-Eye"
          className="h-8 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 text-sm text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-foreground-disabled)] focus:border-[var(--color-border-focus)]"
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
