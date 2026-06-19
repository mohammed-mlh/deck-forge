import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Brain,
  Database,
  FolderOpen,
  Hammer,
  Layers,
  Search,
  Shield,
  Sparkles,
  Swords,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { GetStartedButton } from "@/components/auth/get-started-button";
import { Container } from "@/components/layout/container";
import { FEATURED_ARCHETYPES } from "@/content/seo-archetypes";
import { getCards } from "@/features/cards/cards.service";
import { getCardArtUrl } from "@/lib/deck-preview";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "DeckForge · Modern Yu-Gi-Oh Deck Building",
  description:
    "Build, browse, and share Yu-Gi-Oh decks with a full card database and drag-and-drop deck builder.",
  path: "/",
});

const features = [
  {
    icon: Hammer,
    title: "Drag-and-Drop Builder",
    description:
      "Construct your deck visually. Drag cards between Main, Extra, and Side zones with instant rule validation.",
  },
  {
    icon: Database,
    title: "Full Card Database",
    description:
      "Search all 12,000+ cards with advanced filters — attribute, archetype, ATK/DEF ranges, link markers, and more.",
  },
  {
    icon: Layers,
    title: "Community Decks",
    description:
      "Browse public decks shared by other players. One click to fork into your builder and start customizing.",
  },
  {
    icon: Brain,
    title: "AI Deck Analysis",
    description:
      "Get a breakdown of your deck's type distribution, key cards, consistency, and archetype classification.",
  },
  {
    icon: Sparkles,
    title: "Deck Doctor",
    description:
      "AI-powered improvement suggestions that respect your current deck composition and zone rules.",
  },
  {
    icon: Braces,
    title: "10 Import Formats",
    description:
      "Import and export via YDK, YDKE, YGOProDeck TXT, JSON, CSV, XML, and more — paste or upload.",
  },
];

const stats = [
  { value: "12,000+", label: "Cards" },
  { value: "10+", label: "Import formats" },
  { value: "Cloud", label: "Deck storage" },
  { value: "Free", label: "Forever" },
];

const highlights = [
  { icon: Shield, label: "Zone rules enforced" },
  { icon: Zap, label: "Instant validation" },
  { icon: Users, label: "Community decks" },
  { icon: FolderOpen, label: "Cloud saved" },
];

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search the card pool",
    description:
      "Filter all 12,000+ cards by attribute, archetype, and stats to find exactly what you need.",
  },
  {
    step: "02",
    icon: Swords,
    title: "Build your deck",
    description:
      "Drag cards into Main, Extra, and Side zones with real-time copy limits and rule validation.",
  },
  {
    step: "03",
    icon: Upload,
    title: "Save and share",
    description:
      "Save to your account, export in any format, or publish your deck for the community.",
  },
];

const popularArchetypes = FEATURED_ARCHETYPES.slice(0, 8);

async function resolveArchetypeArt() {
  const results = await Promise.all(
    popularArchetypes.map(async (archetype) => {
      const byName = await getCards({ name: archetype.featuredCardName, num: 1 });
      const card =
        byName[0] ?? (await getCards({ archetype: archetype.name, num: 1 }))[0];
      return [archetype.slug, card ? getCardArtUrl(card) : undefined] as const;
    })
  );
  return new Map(results);
}

export default async function HomePage() {
  const archetypeArt = await resolveArchetypeArt();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-(--color-border)">
        <Container>
          <div className="flex flex-col items-center gap-6 py-24 text-center md:py-20">
            
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-(--color-foreground) md:text-[3.25rem] md:leading-[1.15]">
              The professional deck building platform for{" "}
              <span className="text-(--color-primary)">competitive play</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-(--color-foreground-muted)">
              Build, analyze, and share Yu-Gi-Oh! decks with a full card database, drag-and-drop
              builder, AI insights, and community deck browser — all in one place.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <GetStartedButton>Start Building Free</GetStartedButton>
              <Link
                href="/decks"
                className="inline-flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-5 py-2.5 text-sm font-medium text-(--color-foreground) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
              >
                Browse Decks
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
              {highlights.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-(--color-foreground-subtle)"
                >
                  <Icon className="size-3.5 text-(--color-primary)" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section className="border-b border-(--color-border)/60 bg-(--color-bg-surface)/50 backdrop-blur-sm">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-(--color-border) md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-8 text-center">
                <span className="text-2xl font-semibold tabular-nums text-(--color-foreground)">
                  {stat.value}
                </span>
                <span className="text-sm text-(--color-foreground-muted)">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col gap-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Everything you need to compete
              </h2>
              <p className="mt-3 text-base text-(--color-foreground-muted)">
                Professional tools built for players who take the game seriously.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group flex flex-col gap-4 rounded-xl border border-(--color-border)/80 bg-(--color-surface-1)/70 p-6 backdrop-blur-sm transition-colors hover:border-(--color-border-strong) hover:bg-(--color-bg-elevated)/80"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-(--color-primary-muted) text-(--color-primary)">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-(--color-foreground)">{title}</h3>
                    <p className="text-sm leading-relaxed text-(--color-foreground-muted)">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="border-b border-(--color-border)/60 bg-(--color-bg-surface)/50 py-24 backdrop-blur-sm">
        <Container>
          <div className="flex flex-col gap-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                From idea to finished deck
              </h2>
              <p className="mt-3 text-base text-(--color-foreground-muted)">
                Three steps. No friction.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map(({ step, icon: Icon, title, description }, index) => (
                <div key={step} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--color-primary-muted)">
                      <Icon className="size-5 text-(--color-primary)" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden h-px flex-1 bg-linear-to-r from-(--color-border) to-transparent md:block" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-(--color-primary)">
                      {step}
                    </span>
                    <h3 className="mt-1 font-semibold text-(--color-foreground)">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-(--color-foreground-muted)">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Popular archetypes ──────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col gap-14">
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Explore popular archetypes
              </h2>
              <p className="max-w-xl text-base text-(--color-foreground-muted)">
                Strategy guides, key cards, and deck-building tips for the game&apos;s most-played
                decks.
              </p>
            </div>

            <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
              {popularArchetypes.map((archetype) => {
                const artUrl = archetypeArt.get(archetype.slug);
                return (
                  <Link
                    key={archetype.slug}
                    href={`/archetypes/${archetype.slug}`}
                    className="group relative h-80 w-64 shrink-0 snap-start overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong)"
                  >
                    {artUrl && (
                      <Image
                        src={artUrl}
                        alt={archetype.name}
                        fill
                        sizes="256px"
                        className="object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-linear-to-b from-black/70 to-transparent p-4">
                      <span className="font-semibold text-white">{archetype.name}</span>
                      <ArrowRight className="size-4 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/archetypes"
              className="mx-auto inline-flex items-center gap-2 text-sm font-medium text-(--color-primary) transition-colors hover:text-(--color-primary-hover)"
            >
              View all archetypes
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-(--color-primary-muted)">
              <Layers className="size-7 text-(--color-primary)" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
              Ready to build your next deck?
            </h2>
            <p className="text-base text-(--color-foreground-muted)">
              Join other duelists building smarter with DeckForge. Free forever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GetStartedButton>Get Started Free</GetStartedButton>
              <Link
                href="/app/cards"
                className="inline-flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-5 py-2.5 text-sm font-medium text-(--color-foreground) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
              >
                Browse Cards
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
