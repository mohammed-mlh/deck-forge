import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonCardProps {
  title: string;
  description?: string;
  className?: string;
}

export function ComingSoonCard({ title, description, className }: ComingSoonCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-[var(--color-foreground-subtle)]" />
        <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs font-medium text-[var(--color-foreground-muted)]">
          Coming Soon
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">{description}</p>
        )}
      </div>
    </div>
  );
}
