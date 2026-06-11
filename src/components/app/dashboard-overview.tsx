"use client";

import { Hammer, FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { SectionHeader } from "@/components/layout/section-header";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { countZone } from "@/lib/deck-rules";

const quickActions = [
  {
    title: "New Deck",
    description: "Start building a new deck from scratch.",
    icon: Hammer,
    href: "/deck-builder",
  },
  {
    title: "My Decks",
    description: "View and manage your saved decks.",
    icon: FolderOpen,
    href: "/decks",
  },
];

export function DashboardOverview() {
  const { decks, ready } = useSavedDecks();

  const totalCards = decks.reduce(
    (sum, deck) =>
      sum + countZone(deck.main) + countZone(deck.extra) + countZone(deck.side),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your activity."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Saved Decks"
          value={ready ? String(decks.length) : "—"}
          trend="neutral"
        />
        <StatCard
          label="Cards in Decks"
          value={ready ? String(totalCards) : "—"}
          trend="neutral"
        />
      </div>

      <section>
        <SectionHeader title="Quick Actions" className="mb-4" />
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="block">
              <div className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-muted)]">
                  <action.icon className="size-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {action.title}
                  </span>
                  <span className="truncate text-xs text-[var(--color-foreground-muted)]">
                    {action.description}
                  </span>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-[var(--color-foreground-subtle)] transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
