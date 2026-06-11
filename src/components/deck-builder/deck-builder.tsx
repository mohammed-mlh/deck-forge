"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DragDropProvider } from "@/components/deck-builder/drag-drop-provider";
import { CardSearchPanel } from "@/components/deck-builder/card-search-panel";
import { DeckZonePanel } from "@/components/deck-builder/deck-zone";
import { DeckPanelHeader } from "@/components/deck-builder/deck-panel-header";
import { useDeck } from "@/hooks/use-deck";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { downloadDeckTxt } from "@/lib/deck-export";
import { getDefaultZoneForCard } from "@/lib/deck-rules";
import type { DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

export function DeckBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("id");
  const { save, getById } = useSavedDecks();
  const { deck, stats, addCard, removeCard, resetDeck, setDeckName, replaceDeck } =
    useDeck();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!deckId) {
      loadedIdRef.current = null;
      return;
    }
    if (deckId === loadedIdRef.current) return;
    const saved = getById(deckId);
    if (saved) {
      replaceDeck(saved);
      loadedIdRef.current = deckId;
    }
  }, [deckId, getById, replaceDeck]);

  const handleSave = () => {
    save(deck);
    setSaveStatus("saved");
    router.replace(`/app/builder?id=${deck.id}`);
    window.setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleDrop = (card: YugiohCard, zone: DeckZone) => {
    addCard(card, zone);
  };

  const handleAdd = (card: YugiohCard, zone?: DeckZone) => {
    addCard(card, zone ?? getDefaultZoneForCard(card));
  };

  return (
    <DragDropProvider onDropOnZone={handleDrop}>
      <div className="flex h-full min-h-0">
        {/* Card pool — fixed-width left column, full height */}
        <CardSearchPanel
          onAddCard={handleAdd}
          className="w-[clamp(260px,32vw,400px)] shrink-0"
        />

        {/* Deck area — header + main (fills) + extra/side strips at bottom */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DeckPanelHeader
            deckName={deck.name}
            onDeckNameChange={setDeckName}
            main={stats.main}
            extra={stats.extra}
            side={stats.side}
            saveStatus={saveStatus}
            onSave={handleSave}
            onClear={resetDeck}
            onExport={() => downloadDeckTxt(deck)}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <DeckZonePanel
              zone="main"
              layout="expanded"
              entries={deck.main}
              deck={deck}
              onRemove={(id) => removeCard(id, "main")}
              onAdd={(card) => handleAdd(card, "main")}
              className="min-h-0 flex-1"
            />

            <DeckZonePanel
              zone="extra"
              layout="strip"
              entries={deck.extra}
              deck={deck}
              onRemove={(id) => removeCard(id, "extra")}
              onAdd={(card) => handleAdd(card, "extra")}
            />
            <DeckZonePanel
              zone="side"
              layout="strip"
              entries={deck.side}
              deck={deck}
              onRemove={(id) => removeCard(id, "side")}
              onAdd={(card) => handleAdd(card, "side")}
            />
          </div>
        </section>
      </div>
    </DragDropProvider>
  );
}
