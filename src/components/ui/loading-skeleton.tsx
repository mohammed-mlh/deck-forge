import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DeckBuilderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3 p-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-(--color-border) p-3">
          <Skeleton className="mb-3 h-4 w-20" />
          <div className="grid grid-cols-5 gap-1 sm:grid-cols-7 lg:grid-cols-10">
            {Array.from({ length: 10 }).map((_, j) => (
              <Skeleton key={j} className="aspect-[59/86] w-full rounded-[2px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
