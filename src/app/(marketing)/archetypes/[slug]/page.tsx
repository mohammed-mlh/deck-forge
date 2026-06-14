import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ArchetypeCardGrid } from "@/components/seo/archetype-card-grid";
import { SeoArticle, SeoCta, SeoRelatedLinks } from "@/components/seo/seo-content";
import { getFeaturedArchetype, getFeaturedArchetypeSlugs } from "@/content/seo-archetypes";
import { createPageMetadata } from "@/lib/site-metadata";
import { resolveArchetype } from "@/lib/seo/content";
import { JsonLd } from "@/lib/seo/json-ld";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getFeaturedArchetypeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const archetype = await resolveArchetype(slug);
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
  const archetype = await resolveArchetype(slug);
  if (!archetype) notFound();

  const featured = getFeaturedArchetype(slug);
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

  return (
    <Container size="md">
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
        <PageHeader title={`${archetype.name} Archetype`} description={archetype.description} />

        <SeoArticle sections={archetype.overview} />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-(--color-foreground)">Key cards</h2>
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
