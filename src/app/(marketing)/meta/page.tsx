import type { Metadata } from "next";
import { BarChart2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Meta",
  description: "Track the competitive Yu-Gi-Oh meta with tournament data and deck trends.",
};

export default function MetaPage() {
  return (
    <Container className="py-10">
      <PageHeader
        title="Meta Tracker"
        description="Real-time competitive landscape based on recent tournament results."
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Decks Tracked"    value="2,840" change="+12%" trend="up"      />
        <StatCard label="Tournaments"      value="38"    change="+4"   trend="up"      />
        <StatCard label="Unique Archetypes" value="94"   change="-2"   trend="down"    />
        <StatCard label="Last Updated"     value="Today"               trend="neutral" />
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <SectionHeader
            title="Top Decks This Format"
            description="Ranked by tournament placement and representation."
            className="mb-4"
          />
          <EmptyState
            icon={<BarChart2 className="size-5" />}
            title="Meta breakdown coming soon"
            description="Tier lists, win rates, and deck distribution charts."
            className="py-20"
          />
        </section>

        <section>
          <SectionHeader title="Recent Tournament Results" className="mb-4" />
          <EmptyState
            icon={<BarChart2 className="size-5" />}
            title="Tournament results coming soon"
            description="YCS, Regional, and online event results."
            className="py-20"
          />
        </section>
      </div>
    </Container>
  );
}
