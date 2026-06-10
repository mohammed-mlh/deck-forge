import type { Metadata } from "next";
import { Library, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata: Metadata = { title: "Collection" };

export default function CollectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Collection" description="Track your physical and digital card collection.">
        <button className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-sm text-[var(--color-foreground-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]">
          <Upload className="size-4" />
          Import
        </button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Cards"      value="0" trend="neutral" />
        <StatCard label="Unique Cards"     value="0" trend="neutral" />
        <StatCard label="Collection Value" value="$0" trend="neutral" />
        <StatCard label="Missing for Decks" value="0" trend="neutral" />
      </div>

      <section>
        <SectionHeader title="Your Cards" className="mb-4" />
        <EmptyState
          icon={<Library className="size-5" />}
          title="Collection is empty"
          description="Import a YDK file or add cards manually to track your collection."
          className="py-24"
        >
          <button className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]">
            <Upload className="size-4" />
            Import Collection
          </button>
        </EmptyState>
      </section>
    </div>
  );
}
