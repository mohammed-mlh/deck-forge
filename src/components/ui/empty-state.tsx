import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-(--color-border) px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-foreground-subtle)">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-(--color-foreground)">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-(--color-foreground-muted)">{description}</p>
        )}
      </div>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
