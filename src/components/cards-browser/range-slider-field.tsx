"use client";

import { Range } from "react-range";
import { cn } from "@/lib/utils";

interface RangeSliderFieldProps {
  label: string;
  values: [number, number];
  min: number;
  max: number;
  step: number;
  onChange: (values: [number, number]) => void;
  className?: string;
}

export function RangeSliderField({
  label,
  values,
  min,
  max,
  step,
  onChange,
  className,
}: RangeSliderFieldProps) {
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
