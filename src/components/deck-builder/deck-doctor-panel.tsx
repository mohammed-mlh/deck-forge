"use client";

import { useCallback, useState } from "react";
import {
  AlertTriangle,
  Layers,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeckDoctorCardChange, DeckDoctorResult } from "@/lib/ai/types";
import type { Deck } from "@/types/deck";
import { cn } from "@/lib/utils";

type DoctorStatus = "idle" | "empty" | "loading" | "error" | "success";

interface DeckDoctorPanelProps {
  deck: Deck;
  embedded?: boolean;
  className?: string;
}

function isDeckEmpty(deck: Deck): boolean {
  return deck.main.length === 0 && deck.extra.length === 0 && deck.side.length === 0;
}

function DoctorSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="mt-4 h-3 w-16" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

function ChangeList({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "remove" | "add";
  items: DeckDoctorCardChange[];
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
        {title}
      </h3>
      <ul className="divide-y divide-(--color-border) rounded-lg border border-(--color-border)">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className={cn(
              "flex items-start gap-2.5 px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg",
              tone === "remove"
                ? "bg-(--color-danger)/5"
                : "bg-(--color-success)/5"
            )}
          >
            <span className="mt-0.5 shrink-0">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-(--color-foreground)">
                {item.quantity}x {item.name}
              </p>
              {item.zone && (
                <p className="text-[11px] capitalize text-(--color-foreground-subtle)">
                  {item.zone} deck
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DoctorContent({ result }: { result: DeckDoctorResult }) {
  return (
    <div className="flex flex-col gap-5">
      <ChangeList
        title="Remove"
        tone="remove"
        icon={<Minus className="size-3.5 text-(--color-danger)" />}
        items={result.remove}
      />

      <ChangeList
        title="Add"
        tone="add"
        icon={<Plus className="size-3.5 text-(--color-success)" />}
        items={result.add}
      />

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-foreground-subtle)">
          Reason
        </h3>
        <p className="text-sm leading-relaxed text-(--color-foreground-muted)">{result.reason}</p>
      </section>
    </div>
  );
}

export function DeckDoctorPanel({ deck, embedded = false, className }: DeckDoctorPanelProps) {
  const deckEmpty = isDeckEmpty(deck);
  const [status, setStatus] = useState<DoctorStatus>(deckEmpty ? "empty" : "idle");
  const [result, setResult] = useState<DeckDoctorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runDoctor = useCallback(async () => {
    if (isDeckEmpty(deck)) {
      setStatus("empty");
      setResult(null);
      setErrorMessage(null);
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/deck/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const error =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "Deck doctor failed";
        throw new Error(error);
      }

      setResult(data as DeckDoctorResult);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Deck doctor failed");
      setStatus("error");
      setResult(null);
    }
  }, [deck]);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        embedded ? "h-full" : "h-full border-l border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {status === "idle" && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-(--color-primary-muted) text-(--color-primary)">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-(--color-foreground)">Deck Doctor</h3>
              <p className="max-w-[220px] text-xs text-(--color-foreground-muted)">
                Get specific cards to cut and add, tailored to your list.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void runDoctor()}
              className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
            >
              Improve My Deck
            </button>
          </div>
        )}

        {status !== "idle" && status !== "loading" && status !== "empty" && (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => void runDoctor()}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2)"
            >
              <RefreshCw className="size-3.5" />
              Re-run
            </button>
          </div>
        )}

        {status === "loading" && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-(--color-foreground-muted)">
              <Loader2 className="size-4 animate-spin text-(--color-primary)" />
              <p className="text-xs">Reviewing your deck…</p>
            </div>
            <DoctorSkeleton />
          </div>
        )}

        {status === "empty" && (
          <EmptyState
            icon={<Layers className="size-5" />}
            title="Deck is empty"
            description="Add cards before asking the deck doctor for improvements."
            className="border-solid py-12"
          />
        )}

        {status === "error" && (
          <EmptyState
            icon={<AlertTriangle className="size-5" />}
            title="Deck doctor failed"
            description={errorMessage ?? "Something went wrong. Try again."}
            className="border-solid py-12"
          >
            <button
              type="button"
              onClick={() => void runDoctor()}
              className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
            >
              Try again
            </button>
          </EmptyState>
        )}

        {status === "success" && result && <DoctorContent result={result} />}
      </div>
    </div>
  );
}
