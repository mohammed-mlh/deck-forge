import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Brain,
  Check,
  ChevronRight,
  Clock,
  Database,
  FileDown,
  FileUp,
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
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "DeckForge — Modern Yu-Gi-Oh Deck Building",
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

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search the card pool",
    description:
      "Use the full-featured card browser with attribute, archetype, and stat filters to find exactly the cards you need.",
  },
  {
    step: "02",
    icon: Swords,
    title: "Build your deck",
    description:
      "Drag cards into Main, Extra, and Side zones. Real-time copy limits, zone rules, and validation keep your deck legal.",
  },
  {
    step: "03",
    icon: Upload,
    title: "Save and share",
    description:
      "Save to your account, export in any format, or make your deck public for the community to copy.",
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

const importFormats = [
  { label: "YDK", desc: "Edopro / YGOPro" },
  { label: "YDKE URL", desc: "DuelingBook" },
  { label: "YGOProDeck TXT", desc: "ygoprodeck.com" },
  { label: "JSON Portable", desc: "Ref format" },
  { label: "JSON Full", desc: "Complete export" },
  { label: "CSV", desc: "Spreadsheet" },
  { label: "TSV", desc: "Tab-separated" },
  { label: "XML", desc: "Structured" },
  { label: "Plain IDs", desc: "Comma or newline" },
  { label: "Plain Names", desc: "One per line" },
];

const aiCapabilities = [
  "Type distribution (monster / spell / trap)",
  "Extra Deck breakdown by summoning method",
  "Key cards and their role in the strategy",
  "Archetype classification with confidence score",
  "Consistency signals — duplicates, zone fill",
  "Deck Doctor: add & remove suggestions",
];

const builderCapabilities = [
  "Main, Extra, and Side zone management",
  "3-copy limit enforced across all zones",
  "Extra Deck monsters auto-routed correctly",
  "Real-time zone count indicators",
  "Inline validation issues banner",
  "Drag between zones to reposition cards",
];

const faqItems = [
  {
    q: "Is DeckForge free?",
    a: "Yes, completely free. Create an account with Clerk — no credit card required.",
  },
  {
    q: "Can I import a deck I already built on YGOProDeck or Edopro?",
    a: "Yes. Paste or upload your YDK, YDKE URL, or YGOProDeck TXT and it imports in seconds.",
  },
  {
    q: "How does the AI analysis work?",
    a: "It reads your deck's card data and produces a structured analysis covering type distribution, key cards, archetype, and consistency. Deck Doctor then suggests specific swaps to improve it.",
  },
  {
    q: "Is my data private?",
    a: "All decks default to private. Only decks you explicitly make public appear on the community browse page.",
  },
  {
    q: "Does DeckForge enforce the ban list?",
    a: "Not currently. Zone rules and copy limits are enforced; ban list filtering is on the roadmap.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-(--color-border)">
        {/* Primary glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Decorative millennium-style eye symbol */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
          <svg width="800" height="800" viewBox="0 0 200 200" className="animate-[hex-rotate_120s_linear_infinite]">
            <polygon
              points="100,10 190,55 190,145 100,190 10,145 10,55"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <polygon
              points="100,30 170,65 170,135 100,170 30,135 30,65"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="5" fill="currentColor" opacity="0.5" />
          </svg>
        </div>

        {/* Animated accent lines */}
        <div className="pointer-events-none absolute left-0 top-32 h-px w-32 bg-linear-to-r from-transparent via-(--color-primary)/20 to-transparent animate-[energy-wave_12s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute right-0 top-48 h-px w-24 bg-linear-to-l from-transparent via-(--color-primary)/20 to-transparent animate-[energy-wave_10s_ease-in-out_infinite_2s]" />

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
                href="/app/decks"
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

      {/* ── Builder deep-dive ────────────────────────────────────────── */}
      <section className="border-y border-(--color-border)/60 bg-(--color-bg-surface)/50 py-24 backdrop-blur-sm">
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Text */}
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-(--color-primary)/30 bg-(--color-primary-muted) px-3 py-1 text-xs font-medium text-(--color-primary)">
                <Hammer className="size-3" />
                Deck Builder
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Built like a pro tool,<br />not an afterthought
              </h2>
              <p className="text-base leading-relaxed text-(--color-foreground-muted)">
                The builder enforces game rules in real time. Every add, move, and zone change is
                validated — so you ship a legal deck, every time.
              </p>
              <ul className="flex flex-col gap-3">
                {builderCapabilities.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-(--color-foreground-muted)">
                    <Check className="mt-0.5 size-4 shrink-0 text-(--color-success)" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/app/deck-builder"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-(--color-primary) transition-colors hover:text-(--color-primary-hover)"
              >
                Open the builder
                <ChevronRight className="size-4" />
              </Link>
            </div>

            {/* Visual */}
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-1) p-1 shadow-xl">
              <div className="rounded-xl border border-(--color-border) bg-(--color-bg-elevated) p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-(--color-danger)/60" />
                  <div className="size-2.5 rounded-full bg-(--color-warning)/60" />
                  <div className="size-2.5 rounded-full bg-(--color-success)/60" />
                  <span className="ml-2 text-xs text-(--color-foreground-subtle)">deck-builder</span>
                </div>
                {["Main Deck", "Extra Deck", "Side Deck"].map((zone, i) => {
                  const counts = [42, 10, 5];
                  const maxes = [60, 15, 15];
                  const fills = [42 / 60, 10 / 15, 5 / 15];
                  return (
                    <div key={zone} className="mb-3 last:mb-0">
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-(--color-foreground-muted)">{zone}</span>
                        <span className="tabular-nums text-(--color-foreground-subtle)">
                          {counts[i]}/{maxes[i]}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-(--color-surface-3)">
                        <div
                          className="h-full rounded-full bg-(--color-primary)"
                          style={{ width: `${fills[i]! * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-5 grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-59/86 rounded-[2px]"
                      style={{
                        background:
                          i < 12
                            ? `hsl(${260 + (i % 4) * 15}, 60%, ${30 + (i % 3) * 5}%)`
                            : "var(--color-surface-2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── AI section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 80% 50%, rgba(124,58,237,0.10) 0%, transparent 70%)",
          }}
        />
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Visual */}
            <div className="order-2 lg:order-1 rounded-2xl border border-(--color-border) bg-(--color-surface-1) p-5">
              <div className="mb-3 flex items-center gap-2 border-b border-(--color-border) pb-3">
                <Brain className="size-4 text-(--color-primary)" />
                <span className="text-sm font-medium text-(--color-foreground)">Deck Analysis</span>
                <span className="ml-auto rounded-full bg-(--color-success)/15 px-2 py-0.5 text-xs text-(--color-success)">
                  Ready
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Archetype", value: "Salamangreat", pct: null },
                  { label: "Monsters", value: "24", pct: 57 },
                  { label: "Spells", value: "12", pct: 29 },
                  { label: "Traps", value: "6", pct: 14 },
                  { label: "Extra Deck", value: "15 / 15", pct: 100 },
                ].map(({ label, value, pct }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-(--color-foreground-muted)">{label}</span>
                      <span className="tabular-nums text-(--color-foreground)">{value}</span>
                    </div>
                    {pct !== null && (
                      <div className="h-1 overflow-hidden rounded-full bg-(--color-surface-3)">
                        <div
                          className="h-full rounded-full bg-(--color-primary)"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-2 rounded-lg bg-(--color-surface-2) p-3 text-xs leading-relaxed text-(--color-foreground-muted)">
                  <span className="font-semibold text-(--color-primary)">Deck Doctor: </span>
                  Consider replacing 1× Effect Veiler with 1× Infinite Impermanence for hand trap
                  flexibility against established boards.
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2 flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-(--color-primary)/30 bg-(--color-primary-muted) px-3 py-1 text-xs font-medium text-(--color-primary)">
                <Brain className="size-3" />
                AI Tools
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Your deck, analyzed<br />in seconds
              </h2>
              <p className="text-base leading-relaxed text-(--color-foreground-muted)">
                One click runs a full analysis — archetype, type distribution, key cards, and
                consistency signals. Deck Doctor then proposes targeted swaps.
              </p>
              <ul className="flex flex-col gap-3">
                {aiCapabilities.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-(--color-foreground-muted)">
                    <Check className="mt-0.5 size-4 shrink-0 text-(--color-success)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Import / Export ──────────────────────────────────────────── */}
      <section className="border-y border-(--color-border)/60 bg-(--color-bg-surface)/50 py-24 backdrop-blur-sm">
        <Container>
          <div className="flex flex-col gap-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Import from anywhere,<br />export to everywhere
              </h2>
              <p className="mt-3 text-base text-(--color-foreground-muted)">
                10 formats supported. Paste a URL, upload a file, or copy raw text — DeckForge
                detects the format automatically.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              {/* Import */}
              <div className="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface-1) p-6">
                <div className="flex items-center gap-3 border-b border-(--color-border) pb-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-(--color-primary-muted)">
                    <FileDown className="size-4 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-(--color-foreground)">Import</p>
                    <p className="text-xs text-(--color-foreground-subtle)">Auto-detects format</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {importFormats.map(({ label, desc }) => (
                    <div
                      key={label}
                      className="flex flex-col gap-0.5 rounded-lg bg-(--color-surface-2) px-3 py-2"
                    >
                      <span className="text-xs font-medium text-(--color-foreground)">{label}</span>
                      <span className="text-[10px] text-(--color-foreground-subtle)">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <div className="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface-1) p-6">
                <div className="flex items-center gap-3 border-b border-(--color-border) pb-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-(--color-primary-muted)">
                    <FileUp className="size-4 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-(--color-foreground)">Export</p>
                    <p className="text-xs text-(--color-foreground-subtle)">Live preview before download</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 text-sm text-(--color-foreground-muted)">
                  {[
                    "Copy to clipboard or download file",
                    "Live format preview as you switch",
                    "YDKE URL for instant sharing",
                    "JSON full export includes all card data",
                    "Compatible with Edopro, DuelingBook, YGOPro",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-(--color-success)" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="py-24">
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

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="border-y border-(--color-border)/60 bg-(--color-bg-surface)/50 py-24 backdrop-blur-sm">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-12">
            <div className="text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-base text-(--color-foreground-muted)">
                Everything you need to know before you start.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-(--color-border) rounded-xl border border-(--color-border) bg-(--color-surface-1) overflow-hidden">
              {faqItems.map(({ q, a }) => (
                <div key={q} className="flex flex-col gap-2 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-(--color-primary)" />
                    <p className="font-medium text-(--color-foreground)">{q}</p>
                  </div>
                  <p className="pl-7 text-sm leading-relaxed text-(--color-foreground-muted)">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(124,58,237,0.14) 0%, transparent 70%)",
          }}
        />

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
