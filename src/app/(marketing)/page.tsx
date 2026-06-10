import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hammer, Library, Sparkles, BarChart2, Database, Wallet } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FeatureCard } from "@/components/cards/feature-card";

export const metadata: Metadata = {
  title: "DeckForge — Modern Yu-Gi-Oh Deck Building",
  description: "Build, analyze, and optimize your Yu-Gi-Oh decks with professional tools.",
};

const features = [
  {
    icon: <Hammer className="size-5" />,
    title: "Deck Builder",
    description: "Drag-and-drop deck construction with real-time banlist validation.",
  },
  {
    icon: <Database className="size-5" />,
    title: "Card Database",
    description: "Complete card database with rulings, artwork, and pricing history.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "AI Deck Doctor",
    description: "Get AI-powered suggestions to improve consistency and power level.",
  },
  {
    icon: <BarChart2 className="size-5" />,
    title: "Meta Tracker",
    description: "Up-to-date competitive data from YCS and regional events.",
  },
  {
    icon: <Library className="size-5" />,
    title: "Collection Manager",
    description: "Track your cards with condition grading and market value.",
  },
  {
    icon: <Wallet className="size-5" />,
    title: "Price Tracker",
    description: "Monitor prices across major marketplaces and set buy alerts.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)]">
        <Container>
          <div className="flex flex-col items-center gap-6 py-24 text-center md:py-36">
            <div className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-foreground-muted)]">
              Now in public beta
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] md:text-[3rem] md:leading-tight">
              The professional deck building platform for{" "}
              <span className="text-[var(--color-primary)]">competitive play</span>
            </h1>
            <p className="max-w-lg text-base text-[var(--color-foreground-muted)]">
              Build, analyze, and refine your Yu-Gi-Oh decks with tools designed for serious players.
              From card search to AI-powered optimization.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Start Building
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/cards"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]"
              >
                Browse Cards
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] md:grid-cols-4">
            {[
              { value: "12,000+", label: "Cards" },
              { value: "50,000+", label: "Decks Built" },
              { value: "500+",    label: "Archetypes" },
              { value: "Weekly",  label: "Meta Updates" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-8 text-center">
                <span className="text-2xl font-semibold tabular-nums text-[var(--color-foreground)]">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--color-foreground-muted)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col gap-12">
            <SectionHeader
              title="Everything you need to compete"
              description="Professional tools built for players who take the game seriously."
              className="mx-auto max-w-lg text-center [&>*]:mx-auto"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
              Ready to build your next deck?
            </h2>
            <p className="max-w-md text-sm text-[var(--color-foreground-muted)]">
              Join thousands of duelists who use DeckForge to stay ahead of the meta.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Get Started Free
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
