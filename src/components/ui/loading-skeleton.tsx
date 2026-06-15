import { Skeleton } from "@/components/ui/skeleton";
import { DECK_GRID_COLUMNS } from "@/lib/deck-slots";
import { cn } from "@/lib/utils";

function ZoneSkeleton({ slots }: { slots: number }) {
  return (
    <div className="shrink-0">
      <div className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface-2) px-3 py-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="p-1.5">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${DECK_GRID_COLUMNS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: slots }).map((_, i) => (
            <Skeleton key={i} className="aspect-59/86 w-full rounded-[2px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeckBuilderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-0 flex-1 overflow-hidden", className)}>
      {/* Left: card details */}
      <aside className="flex w-[clamp(220px,22vw,280px)] shrink-0 flex-col border-r border-(--color-border) bg-(--color-bg-surface)">
        <div className="shrink-0 border-b border-(--color-border) px-3 py-2.5">
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-full max-w-[200px] rounded-md" />
          <Skeleton className="h-8 w-full max-w-[200px] rounded-md" />
          <Skeleton className="h-8 w-full max-w-[200px] rounded-md" />
        </div>
      </aside>

      {/* Center: deck zones */}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-(--color-border) px-3 py-2.5">
          <Skeleton className="h-8 min-w-0 flex-1 rounded-md" />
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <Skeleton className="size-8 shrink-0 rounded-md" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex flex-col divide-y divide-(--color-border) border-b border-(--color-border)">
            <ZoneSkeleton slots={50} />
            <ZoneSkeleton slots={20} />
            <ZoneSkeleton slots={10} />
          </div>
        </div>
      </section>

      {/* Right: search panel */}
      <aside className="flex w-[clamp(280px,28vw,380px)] shrink-0 flex-col border-l border-(--color-border) bg-(--color-bg-surface)">
        <div className="flex shrink-0 gap-1 border-b border-(--color-border) p-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-14 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 pt-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-59/86 w-full rounded-[2px]" />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
