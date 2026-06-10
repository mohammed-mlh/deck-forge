import type { Metadata } from "next";
import { Search, RotateCcw, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Deck Builder" };

const deckZones = ["Main Deck", "Extra Deck", "Side Deck"];

export default function BuilderPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader title="Deck Builder" description="Create and optimize your decks.">
        <button className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-surface-3)]">
          <RotateCcw className="size-4" />
          Reset
        </button>
        <button className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]">
          <Download className="size-4" />
          Export
        </button>
      </PageHeader>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* Card Search Panel */}
        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 transition-colors focus-within:border-[var(--color-border-focus)]">
            <Search className="size-4 shrink-0 text-[var(--color-foreground-subtle)]" />
            <span className="text-sm text-[var(--color-foreground-disabled)]">Search cards…</span>
          </div>
          <EmptyState
            icon={<Search className="size-5" />}
            title="Card search panel"
            description="Search and filter cards to add to your deck."
            className="flex-1 border-0 py-16"
          />
        </div>

        {/* Deck Panel */}
        <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-foreground)]">My Deck</span>
            <span className="text-xs text-[var(--color-foreground-subtle)]">0/40 cards</span>
          </div>

          {deckZones.map((zone) => (
            <div key={zone} className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-foreground-subtle)]">
                {zone}
              </span>
              <div className="min-h-14 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-3 text-center">
                <p className="text-xs text-[var(--color-foreground-disabled)]">Empty</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
