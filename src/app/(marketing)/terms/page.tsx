import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoArticle } from "@/components/seo/seo-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for using DeckForge.",
  path: "/terms",
});

const sections = [
  {
    heading: "Acceptance",
    body:
      "By accessing or using DeckForge, you agree to these Terms of Service. If you do not agree, do not use the service.",
  },
  {
    heading: "Service description",
    body:
      "DeckForge provides deck building tools, card search, and optional AI-assisted analysis for Yu-Gi-Oh trading card game enthusiasts. The service is provided as-is without warranty.",
  },
  {
    heading: "User accounts",
    body:
      "You are responsible for maintaining the security of your account credentials. You must not share your account or use the service for unlawful purposes.",
  },
  {
    heading: "User content",
    body:
      "You retain ownership of decks you create. By saving decks to the service, you grant DeckForge a license to store and display them as needed to operate the platform. Public deck listings may be visible to other users.",
  },
  {
    heading: "Intellectual property",
    body:
      "Yu-Gi-Oh and related trademarks are the property of Konami. Card images and data are sourced from third-party APIs. DeckForge is not affiliated with or endorsed by Konami.",
  },
  {
    heading: "AI features",
    body:
      "AI-generated deck analysis and suggestions are informational only. They do not guarantee tournament legality, competitive viability, or accuracy. Always verify deck lists before play.",
  },
  {
    heading: "Limitation of liability",
    body:
      "DeckForge and its operators are not liable for any damages arising from use of the service, including data loss, incorrect card information, or reliance on AI suggestions.",
  },
  {
    heading: "Changes",
    body:
      "We may modify these terms at any time. Material changes will be reflected on this page with an updated date.",
  },
];

export default function TermsPage() {
  return (
    <Container>
      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Terms of Service"
          description="Last updated: June 2026"
        />
        <SeoArticle sections={sections} />
      </div>
    </Container>
  );
}
