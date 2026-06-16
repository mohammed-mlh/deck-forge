"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsPolygon } from "@/components/stats-polygon";
import type { DeckAnalysis, DeckScores, DeckSuggestion, SuggestionPriority } from "@/lib/ai/types";
import type { Deck } from "@/features/decks/decks.schema";
import { cn } from "@/lib/utils";

type AnalysisStatus = "empty" | "idle" | "loading" | "error" | "success";

interface DeckAnalysisPanelProps {
  deck: Deck;
  embedded?: boolean;
  className?: string;
}

const priorityStyles: Record<SuggestionPriority, string> = {
  high: "bg-(--color-danger)/15 text-(--color-danger)",
  medium: "bg-(--color-warning)/15 text-(--color-warning)",
  low: "bg-(--color-surface-3) text-(--color-foreground-muted)",
};

function isDeckEmpty(deck: Deck): boolean {
  return deck.main.length === 0 && deck.extra.length === 0 && deck.side.length === 0;
}

export function deckContentKey(deck: Deck): string {
  const zoneKey = (entries: Deck["main"]) =>
    entries
      .map((entry) => `${entry.card.id}:${entry.quantity}`)
      .sort()
      .join(",");
  return `${zoneKey(deck.main)}|${zoneKey(deck.extra)}|${zoneKey(deck.side)}`;
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mx-auto aspect-square w-full max-w-[200px]">
        <Skeleton className="size-full rounded-full" />
      </div>
      <Skeleton className="mx-auto h-8 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

const DECK_SCORE_AXES: { key: keyof Omit<DeckScores, "overall">; label: string; short: string }[] = [
  { key: "consistency", label: "Consistency", short: "CON" },
  { key: "power", label: "Power", short: "PWR" },
  { key: "speed", label: "Speed", short: "SPD" },
  { key: "resilience", label: "Resilience", short: "RES" },
  { key: "flexibility", label: "Flexibility", short: "FLX" },
  { key: "synergy", label: "Synergy", short: "SYN" },
];

function deckScoresToAxes(scores: DeckScores) {
  return DECK_SCORE_AXES.map((item) => ({
    key: item.key,
    label: item.label,
    short: item.short,
    value: scores[item.key],
  }));
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
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
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
    <div className="flex flex-col gap-5">
      <StatsPolygon
        axes={deckScoresToAxes(analysis.scores)}
        overall={analysis.scores.overall}
        showLegend
        className="rounded-lg border border-(--color-border) bg-(--color-surface-1) p-3"
      />

      <section>
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

export function DeckAnalysisPanel({
  deck,
  embedded = false,
  className,
}: DeckAnalysisPanelProps) {
  const deckEmpty = isDeckEmpty(deck);
  const [status, setStatus] = useState<AnalysisStatus>(() => (deckEmpty ? "empty" : "loading"));
  const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
  const [analysisAt, setAnalysisAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = useCallback(async () => {
    if (isDeckEmpty(deck)) {
      setStatus("empty");
      setAnalysis(null);
      setAnalysisAt(null);
      setErrorMessage(null);
      return;
    }

    setStatus("loading");
    setIsAnalyzing(true);
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
      setAnalysisAt(new Date().toISOString());
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Analysis failed");
      setStatus("error");
      setAnalysis(null);
      setAnalysisAt(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [deck]);

  useEffect(() => {
    if (deckEmpty) return;

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`/api/decks/${deck.id}/analysis`);
        const data: unknown = await response.json();
        if (cancelled) return;

        if (response.status === 404) {
          setAnalysis(null);
          setAnalysisAt(null);
          setStatus("idle");
          return;
        }

        if (!response.ok) {
          const error =
            data && typeof data === "object" && "error" in data && typeof data.error === "string"
              ? data.error
              : "Failed to load analysis";
          throw new Error(error);
        }

        const record = data as { analysis: DeckAnalysis; createdAt: string };
        setAnalysis(record.analysis);
        setAnalysisAt(record.createdAt);
        setStatus("success");
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Failed to load analysis");
        setStatus("error");
        setAnalysis(null);
        setAnalysisAt(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deck.id, deckEmpty]);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        embedded ? "h-full" : "h-full border-l border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!deckEmpty && status !== "loading" && status !== "idle" && (
          <div className="mb-3 flex items-center justify-between gap-2">
            {analysisAt && (
              <p className="text-[10px] text-(--color-foreground-subtle)">
                {new Date(analysisAt).toLocaleString()}
              </p>
            )}
            <button
              type="button"
              onClick={() => void runAnalysis()}
              className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2)"
            >
              <RefreshCw className="size-3.5" />
              Re-run
            </button>
          </div>
        )}

        {!deckEmpty && status === "loading" && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-(--color-foreground-muted)">
              <Loader2 className="size-4 animate-spin text-(--color-primary)" />
              <p className="text-xs">{isAnalyzing ? "Analyzing deck…" : "Loading analysis…"}</p>
            </div>
            <AnalysisSkeleton />
          </div>
        )}

        {!deckEmpty && status === "idle" && (
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="No analysis yet"
            description="Run AI analysis to score this deck and get improvement suggestions."
            className="border-solid py-12"
          >
            <button
              type="button"
              onClick={() => void runAnalysis()}
              className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
            >
              Analyze deck
            </button>
          </EmptyState>
        )}

        {deckEmpty && (
          <EmptyState
            icon={<Layers className="size-5" />}
            title="Deck is empty"
            description="Add cards to your main, extra, or side deck before running analysis."
            className="border-solid py-12"
          />
        )}

        {!deckEmpty && status === "error" && (
          <EmptyState
            icon={<AlertTriangle className="size-5" />}
            title="Analysis failed"
            description={errorMessage ?? "Something went wrong. Try again."}
            className="border-solid py-12"
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

        {!deckEmpty && status === "success" && analysis && (
          <AnalysisContent analysis={analysis} />
        )}
      </div>
    </div>
  );
}
