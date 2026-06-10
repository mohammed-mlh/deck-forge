import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const trendConfig = {
  up:      { icon: TrendingUp,   color: "text-[var(--color-success)]" },
  down:    { icon: TrendingDown, color: "text-[var(--color-danger)]"  },
  neutral: { icon: Minus,        color: "text-[var(--color-foreground-subtle)]" },
};

export function StatCard({ label, value, change, trend = "neutral", className }: StatCardProps) {
  const { icon: TrendIcon, color } = trendConfig[trend];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5",
        className
      )}
    >
      <span className="text-sm text-[var(--color-foreground-muted)]">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tabular-nums text-[var(--color-foreground)]">
          {value}
        </span>
        {change && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", color)}>
            <TrendIcon className="size-3.5" />
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
