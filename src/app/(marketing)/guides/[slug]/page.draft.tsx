import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoArticle, SeoCta, SeoRelatedLinks } from "@/components/seo/seo-content";
import { getGuide, getGuideSlugs } from "@/content/seo-guides";
import { createPageMetadata } from "@/lib/site-metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found" };

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${slug}`,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.publishedAt,
          url: `/guides/${slug}`,
        }}
      />

      <div className="flex flex-col gap-10 py-8">
        <PageHeader title={guide.title} description={guide.description} />

        <SeoArticle sections={guide.sections} />

        <SeoCta
          title="Put it into practice"
          description="Build and test decks with the full card database and rule validation."
          primaryHref="/deck-builder"
          primaryLabel="Open deck builder"
          secondaryHref="/cards"
          secondaryLabel="Browse cards"
        />

        {guide.relatedLinks && guide.relatedLinks.length > 0 && (
          <SeoRelatedLinks links={guide.relatedLinks} />
        )}
      </div>
    </Container>
  );
}
