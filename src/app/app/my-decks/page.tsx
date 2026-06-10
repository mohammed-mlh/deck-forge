import type { Metadata } from "next";
import { Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "My Decks" };

export default function MyDecksPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Decks" description="Manage and organize your saved decks.">
        <Link
          href="/app/builder"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="size-4" />
          New Deck
        </Link>
      </PageHeader>

      <EmptyState
        icon={<FolderOpen className="size-5" />}
        title="No decks yet"
        description="Create your first deck to get started."
        className="py-32"
      >
        <Link
          href="/app/builder"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Plus className="size-4" />
          Build a Deck
        </Link>
      </EmptyState>
    </div>
  );
}
