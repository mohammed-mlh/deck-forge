"use client";

import { useId, useSyncExternalStore } from "react";
import { Range } from "react-range";
import { useArchetypes } from "@/hooks/use-archetypes";
import {
  DEFAULT_CARD_FILTERS,
  FILTER_BOUNDS,
  LINK_MARKERS,
  MONSTER_FRAMES,
  MONSTER_RACES,
  SPELL_RACES,
  TRAP_RACES,
  toggleInList,
  toggleScaleValue,
  type CardFilters,
  type CardSort,
} from "@/lib/card-filters";
import { CARD_ATTRIBUTES, type CardTypeFilter } from "@/features/cards/cards.schema";
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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-(--color-foreground-muted)">
        {label}
      </h4>
      {children}
    </div>
  );
}

const LINK_MARKER_ROTATIONS: Record<string, number> = {
  top: 0,
  "top-right": 45,
  right: 90,
  "bottom-right": 135,
  bottom: 180,
  "bottom-left": 225,
  left: 270,
  "top-left": 315,
};

const LINK_MARKER_POSITIONS: Record<string, string> = {
  "top-left": "left-[5%] top-[5%]",
  top: "left-1/2 top-0 -translate-x-1/2",
  "top-right": "right-[5%] top-[5%]",
  left: "left-0 top-1/2 -translate-y-1/2",
  right: "right-0 top-1/2 -translate-y-1/2",
  "bottom-left": "left-[5%] bottom-[5%]",
  bottom: "left-1/2 bottom-0 -translate-x-1/2",
  "bottom-right": "right-[5%] bottom-[5%]",
};

function LinkMarkerArrow({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden>
      <polygon
        points="10,2 4,11 16,11"
        fill={active ? "#d94520" : "#3a5578"}
        stroke={active ? "#ffc8a8" : "none"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkMarkersPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (markers: string[]) => void;
}) {
  const labelByValue = Object.fromEntries(LINK_MARKERS.map((m) => [m.value, m.label]));

  return (
    <div
      className="relative aspect-square w-[88px] rounded-sm bg-[#0a1428] ring-1 ring-[#1e3a5f]"
      role="group"
      aria-label="Link markers"
    >
      {LINK_MARKERS.map(({ value }) => {
        const active = selected.includes(value);

        return (
          <button
            key={value}
            type="button"
            aria-label={labelByValue[value]}
            aria-pressed={active}
            title={labelByValue[value]}
            onClick={() => onChange(toggleInList(selected, value))}
            className={cn(
              "absolute cursor-pointer border-0 bg-transparent p-0 outline-none",
              "transition-opacity hover:opacity-80 focus-visible:opacity-80",
              LINK_MARKER_POSITIONS[value]
            )}
          >
            <span
              className="inline-flex"
              style={{ transform: `rotate(${LINK_MARKER_ROTATIONS[value]}deg)` }}
            >
              <LinkMarkerArrow active={active} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

const PENDULUM_SCALES = Array.from({ length: 14 }, (_, i) => i);

function PendulumScaleGem({ side }: { side: "left" | "right" }) {
  const id = useId();
  const isBlue = side === "left";

  return (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 shrink-0" aria-hidden>
      <defs>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="1" y2="1">
          {isBlue ? (
            <>
              <stop offset="0%" stopColor="#93ddff" />
              <stop offset="45%" stopColor="#2196f3" />
              <stop offset="100%" stopColor="#0d47a1" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#ffb3b3" />
              <stop offset="45%" stopColor="#e53935" />
              <stop offset="100%" stopColor="#8b0000" />
            </>
          )}
        </linearGradient>
      </defs>
      <polygon
        points="10,1 19,7 10,13 1,7"
        fill={`url(#${id}-gem)`}
        stroke="#2a2a2a"
        strokeWidth="0.75"
      />
      <polygon points="10,1 10,7 19,7" fill="rgba(255,255,255,0.35)" />
      <polygon points="10,7 1,7 10,13" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}

function PendulumScalesPicker({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (values: number[]) => void;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-sm bg-[#162616]/60 px-1 py-1 ring-1 ring-[#2a4a2a]/70"
      role="group"
      aria-label="Pendulum scale"
    >
      <PendulumScaleGem side="left" />
      <div className="grid flex-1 grid-cols-7 gap-px">
        {PENDULUM_SCALES.map((scale) => {
          const active = selected.includes(scale);

          return (
            <button
              key={scale}
              type="button"
              aria-label={`Scale ${scale}`}
              aria-pressed={active}
              title={`Scale ${scale}`}
              onClick={() => onChange(toggleScaleValue(selected, scale))}
              className={cn(
                "cursor-pointer border-0 bg-transparent p-0 text-[10px] tabular-nums leading-tight outline-none",
                "transition-opacity hover:opacity-80 focus-visible:opacity-80",
                active ? "font-bold text-(--color-foreground)" : "text-[#555]"
              )}
            >
              {scale}
            </button>
          );
        })}
      </div>
      <PendulumScaleGem side="right" />
    </div>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function CardFiltersPanel({
  filters,
  onChange,
  className,
  compact,
}: CardFiltersPanelProps) {
  const archetypeListId = useId();
  const monsterRaceListId = useId();
  const isClient = useIsClient();
  const { data: archetypes = [] } = useArchetypes();

  const patch = (partial: Partial<CardFilters>) => {    onChange({ ...filters, ...partial });
  };

  const showMonster = filters.type === "all" || filters.type === "monster";
  const showLink =
    showMonster && (filters.frames.includes("link") || filters.frames.length === 0);
  const showScale =
    showMonster &&
    (filters.frames.includes("pendulum") || filters.frames.length === 0);

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
          {isClient &&
            archetypes.map((archetype) => (
              <option key={archetype.id} value={archetype.name} />
            ))}
        </datalist>
      </div>

      {!compact && showMonster && (
        <div className="space-y-3 border-t border-(--color-border) pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-(--color-primary)">
            Monster
          </p>

          <FilterGroup label="Frame">
            <div className="grid grid-cols-2 gap-1.5">
              {MONSTER_FRAMES.map((frame) => (
                <label
                  key={frame.value}
                  className="flex cursor-pointer items-center gap-2 text-xs text-(--color-foreground-muted)"
                >
                  <input
                    type="checkbox"
                    checked={filters.frames.includes(frame.value)}
                    onChange={() =>
                      patch({ frames: toggleInList(filters.frames, frame.value) })
                    }
                    className="size-3.5 rounded border-(--color-border)"
                  />
                  <span>{frame.label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Type (race)">
            <input
              type="text"
              list={monsterRaceListId}
              value={filters.monsterRace}
              onChange={(e) => patch({ monsterRace: e.target.value })}
              placeholder="e.g. Dragon"
              className={cn(selectClass, "placeholder:text-(--color-foreground-disabled)")}
            />
            <datalist id={monsterRaceListId}>
              {isClient &&
                MONSTER_RACES.map((race) => (
                  <option key={race} value={race} />
                ))}
            </datalist>          </FilterGroup>

          <RangeSliderField
            label="Level / Rank"
            values={[filters.levelMin, filters.levelMax]}
            min={FILTER_BOUNDS.level.min}
            max={FILTER_BOUNDS.level.max}
            step={1}
            onChange={([levelMin, levelMax]) => patch({ levelMin, levelMax })}
          />
          <RangeSliderField
            label="ATK"
            values={[filters.atkMin, filters.atkMax]}
            min={FILTER_BOUNDS.atk.min}
            max={FILTER_BOUNDS.atk.max}
            step={100}
            onChange={([atkMin, atkMax]) => patch({ atkMin, atkMax })}
          />
          <RangeSliderField
            label="DEF"
            values={[filters.defMin, filters.defMax]}
            min={FILTER_BOUNDS.def.min}
            max={FILTER_BOUNDS.def.max}
            step={100}
            onChange={([defMin, defMax]) => patch({ defMin, defMax })}
          />

          {showLink && (
            <>
              <RangeSliderField
                label="Link rating"
                values={[filters.linkMin, filters.linkMax]}
                min={FILTER_BOUNDS.link.min}
                max={FILTER_BOUNDS.link.max}
                step={1}
                onChange={([linkMin, linkMax]) => patch({ linkMin, linkMax })}
              />
              <FilterGroup label="Link markers">
                <LinkMarkersPicker
                  selected={filters.linkMarkers}
                  onChange={(linkMarkers) => patch({ linkMarkers })}
                />
              </FilterGroup>
            </>
          )}

          {showScale && (
            <FilterGroup label="Pendulum scale">
              <PendulumScalesPicker
                selected={filters.scaleValues}
                onChange={(scaleValues) => patch({ scaleValues })}
              />
            </FilterGroup>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-xs text-(--color-foreground-muted)">
            <input
              type="checkbox"
              checked={filters.hasEffect}
              onChange={(e) => patch({ hasEffect: e.target.checked })}
              className="size-3.5 rounded border-(--color-border)"
            />
            <span>Has effect only</span>
          </label>
        </div>
      )}

      {!compact && filters.type === "spell" && (
        <FilterGroup label="Spell type">
          <select
            value={filters.spellRace}
            onChange={(e) => patch({ spellRace: e.target.value })}
            className={selectClass}
          >
            <option value="">Any</option>
            {SPELL_RACES.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </FilterGroup>
      )}

      {!compact && filters.type === "trap" && (
        <FilterGroup label="Trap type">
          <select
            value={filters.trapRace}
            onChange={(e) => patch({ trapRace: e.target.value })}
            className={selectClass}
          >
            <option value="">Any</option>
            {TRAP_RACES.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </FilterGroup>
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
          <option value="def-desc">DEF (high → low)</option>
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

function RangeSliderField({
  label,
  values,
  min,
  max,
  step,
  onChange,
  className,
}: {
  label: string;
  values: [number, number];
  min: number;
  max: number;
  step: number;
  onChange: (values: [number, number]) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-(--color-foreground-muted)">{label}</span>
        <span className="text-[11px] tabular-nums text-(--color-foreground-subtle)">
          {values[0]} – {values[1]}
        </span>
      </div>

      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(next) => onChange([next[0], next[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="relative h-1.5 w-full rounded-full bg-(--color-surface-3)"
            style={props.style}
          >
            <div
              className="absolute h-full rounded-full bg-(--color-primary)"
              style={{
                left: `${((values[0] - min) / (max - min)) * 100}%`,
                width: `${((values[1] - values[0]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            key={props.key}
            className="size-3.5 rounded-full border-2 border-(--color-primary) bg-(--color-bg-base) shadow-sm outline-none"
            style={props.style}
          />
        )}
      />
    </div>
  );
}

export { DEFAULT_CARD_FILTERS };
