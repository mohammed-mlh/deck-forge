import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoArticle } from "@/components/seo/seo-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How DeckForge collects, uses, and protects your information.",
  path: "/privacy",
});

const sections = [
  {
    heading: "Overview",
    body:
      "DeckForge respects your privacy. This policy describes what information we collect when you use the service and how it is used.",
  },
  {
    heading: "Information we collect",
    body:
      "When you sign in, authentication is handled by Clerk. We store your account identifier to associate saved decks with your account. We may record anonymous usage events (page views, feature usage) to improve the product. Deck content you save is stored in our database.",
  },
  {
    heading: "Third-party services",
    body:
      "DeckForge uses Clerk for authentication, YGOProDeck for card data, and optionally DeepSeek for AI deck analysis. Each provider has its own privacy policy governing data they process.",
  },
  {
    heading: "Cookies and local storage",
    body:
      "We use browser local storage for theme preferences. Clerk may set cookies required for authentication sessions.",
  },
  {
    heading: "Data retention",
    body:
      "Saved decks remain in your account until you delete them. You may request account and data deletion by contacting the project maintainer.",
  },
  {
    heading: "Changes",
    body:
      "We may update this policy from time to time. Continued use of DeckForge after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <Container>
      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="Privacy Policy"
          description="Last updated: June 2026"
        />
        <SeoArticle sections={sections} />
      </div>
    </Container>
  );
}
