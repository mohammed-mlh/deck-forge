import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Cards",
  description: "Browse the complete Yu-Gi-Oh card database.",
};

const filterChips = ["All", "Monster", "Spell", "Trap", "Extra Deck"];

export default function CardsPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Card Database"
        description="Browse all 12,000+ Yu-Gi-Oh cards."
      >
        <button className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]">
          <SlidersHorizontal className="size-4" />
          Filters
        </button>
      </PageHeader>

      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-4 py-2.5 transition-colors focus-within:border-[var(--color-border-focus)]">
        <Search className="size-4 shrink-0 text-[var(--color-foreground-subtle)]" />
        <span className="text-sm text-[var(--color-foreground-disabled)]">
          Search cards by name, type, attribute…
        </span>
      </div>

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterChips.map((filter, i) => (
          <button
            key={filter}
            className={
              i === 0
                ? "rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-muted)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                : "rounded-full border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-1 text-xs text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Card grid placeholder */}
      <EmptyState
        icon={<Search className="size-5" />}
        title="Card grid coming soon"
        description="Search and filter cards across the full database."
        className="py-32"
      />
    </Container>
  );
}
