import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, children, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-(--color-foreground)">{title}</h2>
        {description && (
          <p className="text-sm text-(--color-foreground-muted)">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      )}
    </div>
  );
}
