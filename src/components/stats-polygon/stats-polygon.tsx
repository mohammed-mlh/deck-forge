"use client";

import { cn } from "@/lib/utils";
import {
  defaultValueColor,
  getLabelPoint,
  getPolygonPoint,
  pointsToPolygonAttr,
  type StatsPolygonAxis,
  type StatsPolygonColors,
  type StatsPolygonLayout,
} from "./utils";

export interface StatsPolygonProps {
  axes: StatsPolygonAxis[];
  maxValue?: number;
  overall?: number;
  overallLabel?: string;
  colors?: StatsPolygonColors;
  layout?: StatsPolygonLayout;
  className?: string;
  showLegend?: boolean;
}

export function StatsPolygon({
  axes,
  maxValue = 100,
  overall,
  overallLabel = "Overall",
  colors = {},
  layout = {},
  className,
  showLegend = false,
}: StatsPolygonProps) {
  const {
    size = 200,
    radius = 70,
    labelRadius = radius + 28,
    gridLevels = [0.25, 0.5, 0.75, 1],
    startAngle = -Math.PI / 2,
  } = layout;

  const {
    fill = "var(--color-primary)",
    stroke = "var(--color-primary)",
    grid = "var(--color-border)",
    axis = "var(--color-border)",
    getValueColor = defaultValueColor,
  } = colors;

  const center = size / 2;
  const axisCount = axes.length;

  const getPoint = (index: number, value: number) =>
    getPolygonPoint(index, value, axisCount, center, radius, maxValue, startAngle);

  const dataPoints = axes.map((item, i) => getPoint(i, item.value));

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <svg width={size} height={size} className="overflow-visible">
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={pointsToPolygonAttr(axes.map((_, i) => getPoint(i, level * maxValue)))}
            fill="none"
            stroke={grid}
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {axes.map((_, i) => {
          const p = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke={axis}
              strokeWidth={1}
              opacity={0.3}
            />
          );
        })}

        <polygon
          points={pointsToPolygonAttr(dataPoints)}
          fill={fill}
          fillOpacity={0.2}
          stroke={stroke}
          strokeWidth={2}
        />

        {dataPoints.map((p, i) => (
          <circle key={axes[i].key} cx={p.x} cy={p.y} r={4} fill={stroke} />
        ))}

        {axes.map((item, i) => {
          const p = getLabelPoint(i, axisCount, center, labelRadius, startAngle);
          const label = item.short ?? item.label;
          return (
            <g key={item.key}>
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                className="fill-(--color-foreground-subtle) text-[9px] font-bold uppercase tracking-wider"
              >
                {label}
              </text>
              <text
                x={p.x}
                y={p.y + 6}
                textAnchor="middle"
                className="text-[11px] font-semibold"
                fill={getValueColor(item.value)}
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>

      {overall !== undefined && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-(--color-foreground-subtle)">
            {overallLabel}
          </span>
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: getValueColor(overall) }}
          >
            {overall}
          </span>
        </div>
      )}

      {showLegend && (
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
          {axes.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-2">
              <span className="text-xs text-(--color-foreground-muted)">{item.label}</span>
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: getValueColor(item.value) }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
