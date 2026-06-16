import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Info,
  Lightbulb,
  ShieldCheck,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ArchetypeCardGrid } from "@/components/seo/archetype-card-grid";
import { SeoCta, SeoRelatedLinks } from "@/components/seo/seo-content";
import {
  buildGenericArchetype,
  getFeaturedArchetype,
  getFeaturedArchetypeSlugs,
} from "@/content/seo-archetypes";
import { getArchetypeBySlug, getArchetypes } from "@/features/archetypes/archetypes.service";
import { getCards } from "@/features/cards/cards.service";
import { getCardArtUrl } from "@/lib/deck-preview";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

const sectionMeta: Record<string, { icon: LucideIcon; accent: string }> = {
  Playstyle: { icon: Swords, accent: "text-(--color-primary)" },
  "Key strengths": { icon: ShieldCheck, accent: "text-emerald-500" },
  "Deck building tips": { icon: Lightbulb, accent: "text-amber-500" },
  "Common weaknesses": { icon: AlertTriangle, accent: "text-orange-500" },
};

function sectionStyle(heading: string) {
  for (const [key, value] of Object.entries(sectionMeta)) {
    if (heading.startsWith(key) || heading.includes(key)) return value;
  }
  return { icon: Info, accent: "text-(--color-primary)" };
}

export async function generateStaticParams() {
  const dbSlugs = (await getArchetypes()).map((archetype) => archetype.slug);
  const slugs = [...new Set([...getFeaturedArchetypeSlugs(), ...dbSlugs])];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const featured = getFeaturedArchetype(slug);
  const record = featured ? null : await getArchetypeBySlug(slug);
  const archetype = featured ?? (record ? buildGenericArchetype(record.name) : null);
  if (!archetype) return { title: "Archetype Not Found" };

  return createPageMetadata({
    title: `${archetype.name} Archetype — Yu-Gi-Oh Deck Guide`,
    description: archetype.description,
    path: `/archetypes/${slug}`,
  });
}

export default async function ArchetypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const featured = getFeaturedArchetype(slug);
  const record = featured ? null : await getArchetypeBySlug(slug);
  const archetype = featured ?? (record ? buildGenericArchetype(record.name) : null);
  if (!archetype) notFound();

  const relatedLinks = [
    {
      label: `Browse ${archetype.name} cards`,
      href: `/cards?archetype=${encodeURIComponent(archetype.name)}`,
    },
    { label: "All archetypes", href: "/archetypes" },
    { label: "Public decks", href: "/decks" },
    ...archetype.relatedSlugs.map((relatedSlug) => {
      const related = getFeaturedArchetype(relatedSlug);
      return related
        ? { label: `${related.name} archetype`, href: `/archetypes/${related.slug}` }
        : null;
    }).filter(Boolean) as { label: string; href: string }[],
  ];

  const featuredCards = await getCards({ name: archetype.featuredCardName, num: 1 });
  const featuredCard = featuredCards[0];

  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${archetype.name} Yu-Gi-Oh Archetype Guide`,
          description: archetype.description,
          url: `/archetypes/${slug}`,
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <Link
          href="/archetypes"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
        >
          <ArrowLeft className="size-4" />
          All archetypes
        </Link>

        <div className="relative flex overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1)">
          <div className="relative z-10 min-w-0 flex-1 p-6 sm:p-8">
            {archetype.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {archetype.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs font-medium text-(--color-foreground-muted)"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl font-semibold tracking-tight text-(--color-foreground) sm:text-3xl">
              {archetype.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--color-foreground-muted) sm:text-base">
              {archetype.description}
            </p>

            {featuredCard && (
              <p className="mt-4 text-xs text-(--color-foreground-subtle)">
                Signature card · {featuredCard.name}
              </p>
            )}
          </div>

          {featuredCard && (
            <div className="relative w-[44%] shrink-0 self-stretch sm:w-[40%]">
              <Image
                src={getCardArtUrl(featuredCard)}
                alt={featuredCard.name}
                fill
                sizes="(max-width: 640px) 44vw, 320px"
                className="object-cover object-[center_20%]"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-(--color-surface-1) via-(--color-surface-1)/70 to-transparent" />
            </div>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-(--color-foreground)">Strategy overview</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {archetype.overview.map((section) => {
              const { icon: Icon, accent } = sectionStyle(section.heading);
              return (
                <article
                  key={section.heading}
                  className="flex flex-col gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-1)/80 p-5 shadow-sm backdrop-blur-sm transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-1)"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-(--color-surface-2)">
                      <Icon className={cn("size-4", accent)} />
                    </span>
                    <h3 className="text-base font-semibold text-(--color-foreground)">
                      {section.heading}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-(--color-foreground-muted)">
                    {section.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-(--color-border) bg-(--color-surface-1)/60 p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-(--color-foreground)">Key cards</h2>
            <p className="text-sm text-(--color-foreground-muted)">
              Core cards that define this archetype&apos;s strategy and power level.
            </p>
          </div>
          <ArchetypeCardGrid
            archetypeName={archetype.name}
            keyCardNames={archetype.keyCardNames}
          />
        </section>

        <SeoCta
          title={`Build a ${archetype.name} deck`}
          description="Import a list or start from scratch in the deck builder with live rule validation."
          primaryHref="/deck-builder"
          primaryLabel="Open deck builder"
          secondaryHref={`/cards?archetype=${encodeURIComponent(archetype.name)}`}
          secondaryLabel="Browse all cards"
        />

        {featured && <SeoRelatedLinks links={relatedLinks} />}

        {!featured && (
          <p className="text-sm text-(--color-foreground-muted)">
            <Link href="/archetypes" className="text-(--color-primary) hover:underline">
              Browse featured archetype guides
            </Link>{" "}
            for in-depth strategy write-ups.
          </p>
        )}
      </div>
    </Container>
  );
}
