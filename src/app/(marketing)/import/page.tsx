import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoContentCard, SeoContentGrid, SeoCta } from "@/components/seo/seo-content";
import { IMPORT_FORMATS, IMPORT_PAGE_INTRO } from "@/content/seo-import";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  title: "Import Yu-Gi-Oh Deck Formats",
  description:
    "Import YDK, YDKE, YGOProDeck TXT, JSON, CSV, and XML deck lists into DeckForge.",
  path: "/import",
});

export default function ImportPage() {
  return (
    <Container size="md">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Import Yu-Gi-Oh Deck Formats",
          description: IMPORT_PAGE_INTRO,
          url: "/import",
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Import Deck Formats"
          description={IMPORT_PAGE_INTRO}
        />

        <SeoContentGrid>
          {IMPORT_FORMATS.map((format) => (
            <SeoContentCard
              key={format.slug}
              href="/deck-builder"
              title={format.name}
              description={format.description}
              meta={format.extension}
            />
          ))}
        </SeoContentGrid>

        <SeoCta
          title="Import a deck now"
          description="Open the builder and use the Import button to paste or upload your list."
          primaryHref="/deck-builder"
          primaryLabel="Open deck builder"
          secondaryHref="/guides/how-to-import-yugioh-decks"
          secondaryLabel="Import guide"
        />

        <p className="text-sm text-(--color-foreground-muted)">
          Need step-by-step help? Read the{" "}
          <Link href="/guides/how-to-import-yugioh-decks" className="text-(--color-primary) hover:underline">
            full import guide
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
