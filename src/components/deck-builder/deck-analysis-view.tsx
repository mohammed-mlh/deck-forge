"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeckAnalysis, DeckSuggestion, SuggestionPriority } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";
import { cn } from "@/lib/utils";

type AnalysisStatus = "empty" | "loading" | "error" | "success";

interface DeckAnalysisViewProps {
  deck: Deck;
  builderHref: string;
}

const priorityStyles: Record<SuggestionPriority, string> = {
  high: "bg-(--color-danger)/15 text-(--color-danger)",
  medium: "bg-(--color-warning)/15 text-(--color-warning)",
  low: "bg-(--color-surface-3) text-(--color-foreground-muted)",
};

function isDeckEmpty(deck: Deck): boolean {
  return deck.main.length === 0 && deck.extra.length === 0 && deck.side.length === 0;
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function AnalysisSection({
  title,
  icon,
  items,
  renderItem,
}: {
  title: string;
  icon: React.ReactNode;
  items: { title: string; description: string }[];
  renderItem?: (item: { title: string; description: string }, index: number) => React.ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-lg border border-(--color-border) bg-(--color-bg-elevated) p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
        {title}
      </h3>
      <ul className="divide-y divide-(--color-border)">
        {items.map((item, index) =>
          renderItem ? (
            <li key={`${item.title}-${index}`} className="py-2.5 first:pt-0 last:pb-0">
              {renderItem(item, index)}
            </li>
          ) : (
            <li key={`${item.title}-${index}`} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
              <span className="mt-0.5 shrink-0">{icon}</span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-(--color-foreground)">{item.title}</p>
                <p className="text-xs leading-relaxed text-(--color-foreground-muted)">
                  {item.description}
                </p>
              </div>
            </li>
          )
        )}
      </ul>
    </section>
  );
}

function SuggestionItem({ item }: { item: DeckSuggestion }) {
  return (
    <div className="flex gap-2.5">
      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-(--color-primary)" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-(--color-foreground)">{item.title}</p>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              priorityStyles[item.priority]
            )}
          >
            {item.priority}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-(--color-foreground-muted)">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function AnalysisContent({ analysis }: { analysis: DeckAnalysis }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-(--color-border) bg-(--color-bg-elevated) p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
          Summary
        </h3>
        <p className="text-sm leading-relaxed text-(--color-foreground-muted)">
          {analysis.summary}
        </p>
      </section>

      <AnalysisSection
        title="Strengths"
        icon={<Check className="size-3.5 text-(--color-success)" />}
        items={analysis.strengths}
      />

      <AnalysisSection
        title="Weaknesses"
        icon={<AlertTriangle className="size-3.5 text-(--color-warning)" />}
        items={analysis.weaknesses}
      />

      <AnalysisSection
        title="Suggestions"
        icon={<ArrowRight className="size-3.5 text-(--color-primary)" />}
        items={analysis.suggestions}
        renderItem={(item) => <SuggestionItem item={item as DeckSuggestion} />}
      />
    </div>
  );
}

export function DeckAnalysisView({ deck, builderHref }: DeckAnalysisViewProps) {
  const [status, setStatus] = useState<AnalysisStatus>("loading");
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (isDeckEmpty(deck)) {
      setStatus("empty");
      setAnalysis(null);
      setErrorMessage(null);
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/deck/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const error =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "Analysis failed";
        throw new Error(error);
      }

      setAnalysis(data as DeckAnalysis);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Analysis failed");
      setStatus("error");
      setAnalysis(null);
    }
  }, [deck]);

  useEffect(() => {
    void runAnalysis();
  }, [runAnalysis]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title="Deck Analysis" description={deck.name}>
        <Link
          href={builderHref}
          className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
        >
          <ArrowLeft className="size-3.5" />
          Back to builder
        </Link>
        {status !== "loading" && status !== "empty" && (
          <button
            type="button"
            onClick={() => void runAnalysis()}
            className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-1.5 text-xs text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
          >
            <RefreshCw className="size-3.5" />
            Re-run
          </button>
        )}
      </PageHeader>

      {status === "loading" && (
        <div className="rounded-lg border border-(--color-border) bg-(--color-bg-elevated) p-6">
          <div className="mb-4 flex items-center gap-2 text-(--color-foreground-muted)">
            <Loader2 className="size-4 animate-spin text-(--color-primary)" />
            <p className="text-sm">Analyzing deck…</p>
          </div>
          <AnalysisSkeleton />
        </div>
      )}

      {status === "empty" && (
        <EmptyState
          icon={<Layers className="size-5" />}
          title="Deck is empty"
          description="Add cards to your main, extra, or side deck before running analysis."
        >
          <Link
            href={builderHref}
            className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
          >
            Go to builder
          </Link>
        </EmptyState>
      )}

      {status === "error" && (
        <EmptyState
          icon={<AlertTriangle className="size-5" />}
          title="Analysis failed"
          description={errorMessage ?? "Something went wrong. Try again."}
        >
          <button
            type="button"
            onClick={() => void runAnalysis()}
            className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
          >
            Try again
          </button>
        </EmptyState>
      )}

      {status === "success" && analysis && <AnalysisContent analysis={analysis} />}
    </div>
  );
}
