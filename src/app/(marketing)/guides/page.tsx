import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { InfoCard } from "@/components/cards/info-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Guides",
  description: "Learn Yu-Gi-Oh strategy, deck building theory, and game mechanics.",
};

const placeholderGuides = [
  {
    title: "Deck Building 101",
    description: "Learn the fundamentals of building a consistent, well-structured deck from scratch.",
    badge: "Beginner",
  },
  {
    title: "Understanding the Extra Deck",
    description: "How to leverage Fusion, Synchro, Xyz, and Link monsters in modern play.",
    badge: "Intermediate",
  },
  {
    title: "Hand Trap Primer",
    description: "A complete guide to the essential hand traps and when to use them.",
    badge: "Competitive",
  },
  {
    title: "Reading the Banlist",
    description: "How to interpret Konami's banlist changes and adapt your deck accordingly.",
    badge: "Meta",
  },
  {
    title: "Going Second Strategies",
    description: "Tools and techniques to break established boards and regain momentum.",
    badge: "Advanced",
  },
  {
    title: "Brick Prevention",
    description: "Ratio theory and card choices that maximize consistency.",
    badge: "Theory",
  },
];

export default function GuidesPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Guides"
        description="Strategy guides, deck building theory, and competitive insights."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderGuides.map((guide) => (
          <InfoCard
            key={guide.title}
            title={guide.title}
            description={guide.description}
            badge={guide.badge}
            href={`/guides/${guide.title.toLowerCase().replace(/\s+/g, "-")}`}
          />
        ))}
      </div>

      <EmptyState
        icon={<BookOpen className="size-5" />}
        title="More guides coming soon"
        description="In-depth written and video guides will be published regularly."
      />
    </Container>
  );
}
