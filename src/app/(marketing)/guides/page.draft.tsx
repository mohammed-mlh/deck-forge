import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoContentCard, SeoContentGrid, SeoCta } from "@/components/seo/seo-content";
import { SEO_GUIDES } from "@/content/seo-guides";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Yu-Gi-Oh Deck Building Guides",
  description:
    "Free Yu-Gi-Oh deck building guides — Main/Extra/Side rules, import help, Extra Deck types, and archetype basics.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Yu-Gi-Oh Deck Building Guides",
          description: "Deck building guides and Yu-Gi-Oh rules reference for new and returning players.",
          url: "/guides",
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Deck Building Guides"
          description="Rules reference and strategy basics to help you build better Yu-Gi-Oh decks on DeckForge."
        />

        <SeoContentGrid>
          {SEO_GUIDES.map((guide) => (
            <SeoContentCard
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              title={guide.title}
              description={guide.description}
              meta={guide.publishedAt}
            />
          ))}
        </SeoContentGrid>

        <SeoCta
          title="Ready to build?"
          description="Open the deck builder with drag-and-drop zones, import support, and AI analysis."
          primaryHref="/deck-builder"
          primaryLabel="Start building"
          secondaryHref="/archetypes"
          secondaryLabel="Browse archetypes"
        />
      </div>
    </Container>
  );
}
