import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  description: string;
  badge?: string;
  href?: string;
  className?: string;
}

export function InfoCard({ title, description, badge, href, className }: InfoCardProps) {
  const content = (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-1) p-5 transition-colors",
        href && "cursor-pointer hover:border-(--color-border-strong) hover:bg-(--color-surface-2)",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          {badge && (
            <span className="w-fit rounded-full bg-(--color-primary-muted) px-2 py-0.5 text-xs font-medium text-(--color-primary)">
              {badge}
            </span>
          )}
          <h3 className="text-sm font-semibold text-(--color-foreground)">{title}</h3>
        </div>
        {href && (
          <ArrowRight className="size-4 shrink-0 text-(--color-foreground-subtle) transition-transform group-hover:translate-x-0.5 group-hover:text-(--color-foreground-muted)" />
        )}
      </div>
      <p className="text-sm leading-relaxed text-(--color-foreground-muted)">{description}</p>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
