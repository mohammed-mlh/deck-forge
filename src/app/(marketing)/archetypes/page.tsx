import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  SeoContentCard,
  SeoContentGrid,
  SeoCta,
} from "@/components/seo/seo-content";
import { FEATURED_ARCHETYPES } from "@/content/seo-archetypes";
import { getCards } from "@/features/cards/cards.service";
import { getCardImageUrl } from "@/lib/cards";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Yu-Gi-Oh Archetypes",
  description:
    "Explore popular Yu-Gi-Oh archetypes — strategy overviews, key cards, and links to browse the full card database.",
  path: "/archetypes",
});

async function resolveFeaturedCardImages() {
  const results = await Promise.all(
    FEATURED_ARCHETYPES.map(async (archetype) => {
      const cards = await getCards({ name: archetype.featuredCardName, num: 1 });
      const card = cards[0];
      return {
        slug: archetype.slug,
        imageUrl: card ? getCardImageUrl(card, "small") : undefined,
        imageAlt: card?.name ?? archetype.featuredCardName,
      };
    })
  );
  return new Map(results.map((result) => [result.slug, result]));
}

export default async function ArchetypesPage() {
  const cardImages = await resolveFeaturedCardImages();

  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Yu-Gi-Oh Archetypes",
          description:
            "Explore popular Yu-Gi-Oh archetypes with key cards and deck building resources.",
          url: "/archetypes",
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Yu-Gi-Oh Archetypes"
          description="Strategy overviews and key cards for popular archetypes. Each page links to the full card browser filtered by archetype."
        />

        <SeoContentGrid>
          {FEATURED_ARCHETYPES.map((archetype) => {
            const image = cardImages.get(archetype.slug);
            return (
              <SeoContentCard
                key={archetype.slug}
                href={`/archetypes/${archetype.slug}`}
                title={archetype.name}
                description={archetype.description}
                tags={archetype.tags}
                imageUrl={image?.imageUrl}
                imageAlt={image?.imageAlt}
                meta={`Featured: ${archetype.featuredCardName}`}
              />
            );
          })}
        </SeoContentGrid>

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
          </Link>{" "}
          or browse{" "}
          <Link href="/guides/what-is-a-yugioh-archetype" className="text-(--color-primary) hover:underline">
            what archetypes are
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
