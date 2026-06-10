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
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-muted)]">
        <span className="text-[var(--color-primary)]">{icon}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-[var(--color-foreground)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">{description}</p>
      </div>
    </div>
  );
}
