export interface Point {
  x: number;
  y: number;
}

export interface StatsPolygonAxis {
  key: string;
  label: string;
  short?: string;
  value: number;
}

export interface StatsPolygonColors {
  fill?: string;
  stroke?: string;
  grid?: string;
  axis?: string;
  getValueColor?: (value: number) => string;
}

export interface StatsPolygonLayout {
  size?: number;
  radius?: number;
  labelRadius?: number;
  gridLevels?: number[];
  startAngle?: number;
}

export function defaultValueColor(value: number): string {
  if (value >= 80) return "var(--color-success)";
  if (value >= 60) return "var(--color-primary)";
  if (value >= 40) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function getPolygonPoint(
  index: number,
  value: number,
  axisCount: number,
  center: number,
  radius: number,
  maxValue: number,
  startAngle: number
): Point {
  const angleStep = (2 * Math.PI) / axisCount;
  const angle = startAngle + index * angleStep;
  const r = (value / maxValue) * radius;
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
}

export function getLabelPoint(
  index: number,
  axisCount: number,
  center: number,
  labelRadius: number,
  startAngle: number
): Point {
  const angleStep = (2 * Math.PI) / axisCount;
  const angle = startAngle + index * angleStep;
  return {
    x: center + labelRadius * Math.cos(angle),
    y: center + labelRadius * Math.sin(angle),
  };
}

export function pointsToPolygonAttr(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
