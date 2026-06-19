import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SeoArticle } from "@/components/seo/seo-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About DeckForge",
  description:
    "DeckForge is a modern Yu-Gi-Oh deck building platform with a full card database, drag-and-drop builder, and AI-powered analysis.",
  path: "/about",
});

const sections = [
  {
    heading: "What is DeckForge?",
    body:
      "DeckForge helps Yu-Gi-Oh players build, browse, and analyze decks. Search thousands of cards, assemble main, extra, and side decks in a visual builder, and explore curated public deck lists.",
  },
  {
    heading: "Features",
    body:
      "Card browser with advanced filters, drag-and-drop deck builder, deck import from popular formats, public deck library, archetype guides, and optional AI deck analysis powered by DeepSeek.",
  },
  {
    heading: "Data sources",
    body:
      "Card and archetype data is synced from the YGOProDeck API. Public decks are curated from community listings. DeckForge is not affiliated with Konami or YGOProDeck.",
  },
  {
    heading: "Contact",
    body:
      "Questions or feedback? Open an issue on our GitHub repository or reach out through the project maintainer.",
  },
];

export default function AboutPage() {
  return (
    <Container>
      <div className="flex flex-col gap-10 py-8">
        <PageHeader
          title="About DeckForge"
          description="A modern platform for competitive Yu-Gi-Oh deck building and analysis."
        />
        <SeoArticle sections={sections} />
      </div>
    </Container>
  );
}
