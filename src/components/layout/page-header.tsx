import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "page" | "section";
}

export function PageHeader({
  title,
  description,
  children,
  className,
  variant = "page",
}: PageHeaderProps) {
  if (variant === "section") {
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

  return (
    <div className={cn("flex flex-col gap-1 pb-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-(--color-foreground)">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-(--color-foreground-muted)">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex shrink-0 items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}
