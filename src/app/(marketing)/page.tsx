import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Hammer, Database, Layers } from "lucide-react";
import { GetStartedButton } from "@/components/auth/get-started-button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "DeckForge — Modern Yu-Gi-Oh Deck Building",
  description: "Build, browse, and share Yu-Gi-Oh decks with a full card database and drag-and-drop deck builder.",
  path: "/",
});

const features = [
  {
    icon: <Hammer className="size-5" />,
    title: "Deck Builder",
    description: "Drag-and-drop deck construction with real-time zone limits and validation.",
  },
  {
    icon: <Database className="size-5" />,
    title: "Card Database",
    description: "Search and filter the full YGOProDeck card database with advanced filters.",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Public Decks",
    description: "Browse community decks and copy them into your builder.",
  },
  {
    icon: <FolderOpen className="size-5" />,
    title: "My Decks",
    description: "Save decks to your account and import or export in multiple formats.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-(--color-border)">
        <Container>
          <div className="flex flex-col items-center gap-6 py-24 text-center md:py-36">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-(--color-foreground) md:text-[3rem] md:leading-tight">
              The professional deck building platform for{" "}
              <span className="text-(--color-primary)">competitive play</span>
            </h1>
            <p className="max-w-lg text-base text-(--color-foreground-muted)">
              Build, browse, and refine your Yu-Gi-Oh decks with a card database, deck builder,
              and shareable public decks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GetStartedButton>Start Building</GetStartedButton>
              <Link
                href="/cards"
                className="inline-flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-5 py-2.5 text-sm font-medium text-(--color-foreground) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-3)"
              >
                Browse Cards
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <section className="border-b border-(--color-border) bg-(--color-bg-surface)">
        <Container>
          <div className="grid grid-cols-2 divide-x divide-(--color-border) md:grid-cols-4">
            {[
              { value: "12,000+", label: "Cards" },
              { value: "Cloud", label: "Saved Decks" },
              { value: "10+", label: "Import Formats" },
              { value: "Free", label: "To Use" },
            ].map((stat) => (
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

      {/* Features */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col gap-12">
            <PageHeader
              variant="section"
              title="Everything you need to compete"
              description="Professional tools built for players who take the game seriously."
              className="mx-auto max-w-lg text-center *:mx-auto"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title}>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-md bg-(--color-primary-muted) text-(--color-primary)">
                      {f.icon}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <CardTitle>{f.title}</CardTitle>
                      <CardDescription>{f.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-(--color-border) bg-(--color-bg-surface) py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground)">
              Ready to build your next deck?
            </h2>
            <p className="max-w-md text-sm text-(--color-foreground-muted)">
              Start with the card database or copy a community deck into the builder.
            </p>
            <GetStartedButton>Get Started Free</GetStartedButton>
          </div>
        </Container>
      </section>
    </>
  );
}
