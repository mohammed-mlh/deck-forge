"use client";

import { useState } from "react";
import { Search, Sparkles, Wand2 } from "lucide-react";
import { CardSearchPanel } from "@/components/deck-builder/card-search-panel";
import { DeckAnalysisPanel, deckContentKey } from "@/components/deck-builder/deck-analysis-panel";
import { DeckDoctorPanel } from "@/components/deck-builder/deck-doctor-panel";
import type { Deck, DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";
import { cn } from "@/lib/utils";

export type DeckBuilderRightPanel = "search" | "analysis" | "doctor";

interface DeckRightPanelProps {
  deck: Deck;
  onAddCard: (card: YugiohCard, zone?: DeckZone) => void;
  onApplyDoctorSuggestion: (deck: Deck) => void;
  onDoctorApplyNotes?: (notes: { errors: string[]; warnings: string[] }) => void;
  onSelectCard?: (card: YugiohCard) => void;
  selectedCardId?: number | null;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

function PanelTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-(--color-primary)/10 text-(--color-primary)"
          : "text-(--color-foreground-muted) hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

export function DeckRightPanel({
  deck,
  onAddCard,
  onApplyDoctorSuggestion,
  onDoctorApplyNotes,
  onSelectCard,
  selectedCardId,
  searchInputRef,
  className,
}: DeckRightPanelProps) {
  const [panel, setPanel] = useState<DeckBuilderRightPanel>("search");

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border-l border-(--color-border) bg-(--color-bg-surface)",
        className
      )}
    >
      <div className="flex shrink-0 gap-1 border-b border-(--color-border) p-2">
        <PanelTab
          active={panel === "search"}
          onClick={() => setPanel("search")}
          icon={Search}
          label="Cards"
        />
        <PanelTab
          active={panel === "analysis"}
          onClick={() => setPanel("analysis")}
          icon={Sparkles}
          label="Analyze"
        />
        <PanelTab
          active={panel === "doctor"}
          onClick={() => setPanel("doctor")}
          icon={Wand2}
          label="Doctor"
        />
      </div>

      <div className={cn("min-h-0 flex-1", panel !== "search" && "hidden")}>
        <CardSearchPanel
          ref={searchInputRef}
          embedded
          onAddCard={onAddCard}
          onSelectCard={onSelectCard}
          selectedCardId={selectedCardId}
        />
      </div>

      <div className={cn("min-h-0 flex-1", panel !== "analysis" && "hidden")}>
        <DeckAnalysisPanel key={deckContentKey(deck)} embedded deck={deck} />
      </div>

      <div className={cn("min-h-0 flex-1", panel !== "doctor" && "hidden")}>
        <DeckDoctorPanel
          embedded
          deck={deck}
          onApplySuggestion={onApplyDoctorSuggestion}
          onApplyNotes={onDoctorApplyNotes}
        />
      </div>
    </div>
  );
}
