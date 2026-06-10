import type { Metadata } from "next";
import { Sparkles, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonCard } from "@/components/ui/coming-soon-card";

export const metadata: Metadata = { title: "AI Assistant" };

const capabilities = [
  {
    title: "Deck Analysis",
    description: "Paste your deck list and receive a breakdown of consistency, power level, and weak points.",
  },
  {
    title: "Card Suggestions",
    description: "Get card recommendations tailored to your archetype and playstyle.",
  },
  {
    title: "Combo Lines",
    description: "Discover optimal combo lines and opening hands for your strategy.",
  },
  {
    title: "Tech Card Advice",
    description: "Find the right hand traps and side deck choices for the current meta.",
  },
];

export default function AIPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Assistant"
        description="Get AI-powered deck analysis and optimization suggestions."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {capabilities.map((cap) => (
          <ComingSoonCard key={cap.title} title={cap.title} description={cap.description} />
        ))}
      </div>

      {/* Chat UI placeholder */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-4">
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-primary-muted)]">
            <Sparkles className="size-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-foreground)]">Deck Doctor AI</p>
            <p className="text-xs text-[var(--color-foreground-subtle)]">Coming soon</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[var(--color-foreground-subtle)]">
            AI chat interface will appear here.
          </p>
        </div>

        <div className="border-t border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5">
            <span className="flex-1 text-sm text-[var(--color-foreground-disabled)]">
              Ask anything about your deck…
            </span>
            <button
              disabled
              className="flex size-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] opacity-40"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
