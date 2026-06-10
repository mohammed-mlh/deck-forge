import type { Metadata } from "next";
import { Hammer, FolderOpen, Library, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/cards/stat-card";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata: Metadata = { title: "Dashboard" };

const quickActions = [
  { title: "New Deck",   description: "Start building a new deck from scratch.",        icon: Hammer,     href: "/app/builder"    },
  { title: "My Decks",  description: "View and manage your saved decks.",               icon: FolderOpen, href: "/app/my-decks"   },
  { title: "Collection", description: "Update your card collection.",                   icon: Library,    href: "/app/collection" },
  { title: "AI Doctor",  description: "Get AI suggestions for your current deck.",      icon: Sparkles,   href: "/app/ai"         },
];

export default function AppDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saved Decks"         value="0" trend="neutral" />
        <StatCard label="Cards in Collection" value="0" trend="neutral" />
        <StatCard label="AI Analyses"         value="0" trend="neutral" />
        <StatCard label="Decks Shared"        value="0" trend="neutral" />
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
                  <span className="text-sm font-medium text-[var(--color-foreground)]">{action.title}</span>
                  <span className="truncate text-xs text-[var(--color-foreground-muted)]">{action.description}</span>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-[var(--color-foreground-subtle)] transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent Activity" className="mb-4" />
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] py-12 text-center">
          <p className="text-sm text-[var(--color-foreground-subtle)]">No recent activity yet.</p>
        </div>
      </section>
    </div>
  );
}
