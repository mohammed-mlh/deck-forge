import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface-1) p-6 transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-md bg-(--color-primary-muted)">
        <span className="text-(--color-primary)">{icon}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-(--color-foreground)">{title}</h3>
        <p className="text-sm leading-relaxed text-(--color-foreground-muted)">{description}</p>
      </div>
    </div>
  );
}
