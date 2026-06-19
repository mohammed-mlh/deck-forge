import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ImageLinkCard } from "@/components/seo/image-link-card";
import { SeoCta } from "@/components/seo/seo-content";
import { buildArchetypeListItems } from "@/features/archetypes/archetypes.view";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Yu-Gi-Oh Archetypes",
  description:
    "Explore Yu-Gi-Oh archetypes — strategy overviews, key cards, and links to browse the full card database.",
  path: "/archetypes",
});

export default async function ArchetypesPage() {
  const archetypes = await buildArchetypeListItems();

  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Yu-Gi-Oh Archetypes",
          description:
            "Explore Yu-Gi-Oh archetypes with key cards and deck building resources.",
          url: "/archetypes",
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Yu-Gi-Oh Archetypes"
          description={`Browse ${archetypes.length} archetypes from the card database. Each page links to cards and deck-building resources.`}
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {archetypes.map((archetype) => (
            <ImageLinkCard
              key={archetype.slug}
              href={`/archetypes/${archetype.slug}`}
              title={archetype.name}
              subtitle={archetype.description ?? undefined}
              imageUrl={archetype.imageUrl}
              imageAlt={archetype.name}
            />
          ))}
        </div>

        <SeoCta
          title="Search all 12,000+ cards"
          description="Use advanced filters for attribute, frame type, stats, link markers, and pendulum scales."
          primaryHref="/app/cards"
          primaryLabel="Open card browser"
          secondaryHref="/guides/yugioh-deck-building-guide"
          secondaryLabel="Deck building guide"
        />

        <p className="text-sm text-(--color-foreground-muted)">
          Looking for a specific archetype?{" "}
          <Link href="/app/cards" className="text-(--color-primary) hover:underline">
            Filter by archetype in the card browser
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
