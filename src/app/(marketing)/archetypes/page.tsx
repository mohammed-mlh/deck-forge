import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoCard } from "@/components/cards/info-card";

export const metadata: Metadata = {
  title: "Archetypes",
  description: "Explore Yu-Gi-Oh archetypes, their history, and key cards.",
};

const placeholderArchetypes = [
  { title: "Blue-Eyes", description: "Kaiba's iconic dragon archetype with powerful Level 8 monsters.", badge: "Classic" },
  { title: "Tearlaments", description: "Fusion-heavy graveyard archetype with exceptional consistency.", badge: "Meta" },
  { title: "Purrely", description: "Xyz archetype based on accumulating Quick Effects from hand.", badge: "Meta" },
  { title: "Labrynth", description: "Control archetype built around Normal Trap cards.", badge: "Rogue" },
  { title: "Spright", description: "Level/Rank/Link 2 engine with incredible toolbox access.", badge: "Tier 1" },
  { title: "Kashtira", description: "Field-locking control strategy that banishes face-down.", badge: "Tier 2" },
];

export default function ArchetypesPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Archetypes"
        description="Explore over 500 Yu-Gi-Oh archetypes, their key cards, and competitive viability."
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderArchetypes.map((archetype) => (
          <InfoCard
            key={archetype.title}
            title={archetype.title}
            description={archetype.description}
            badge={archetype.badge}
            href={`/archetypes/${archetype.title.toLowerCase().replace(/\s+/g, "-")}`}
          />
        ))}
      </div>

      <EmptyState
        icon={<Layers className="size-5" />}
        title="More archetypes loading"
        description="Full archetype database with search and meta filtering coming soon."
      />
    </Container>
  );
}
