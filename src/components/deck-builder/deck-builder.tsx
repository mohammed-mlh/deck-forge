"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DragDropProvider } from "@/components/deck-builder/drag-drop-provider";
import { CardDetailViewer } from "@/components/deck-builder/card-detail-viewer";
import { CardSearchPanel } from "@/components/deck-builder/card-search-panel";
import { DeckZonePanel } from "@/components/deck-builder/deck-zone";
import { DeckIoDialog } from "@/components/deck-builder/deck-io-dialog";
import { ImportResultToast } from "@/components/deck-builder/import-result-toast";
import { DeckPanelHeader } from "@/components/deck-builder/deck-panel-header";
import { useDeck } from "@/hooks/use-deck";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { track } from "@/lib/analytics";
import { usePageView } from "@/hooks/use-page-view";
import { getDefaultZoneForCard } from "@/lib/deck-rules";
import type { DeckZone } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

export function DeckBuilder() {
  const router = useRouter();
  const params = useParams();
  const deckId = typeof params.id === "string" ? params.id : null;
  const { save, getById } = useSavedDecks();
  const { deck, stats, addCard, removeCard, resetDeck, setDeckName, replaceDeck } =
    useDeck();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [ioMode, setIoMode] = useState<"import" | "export" | null>(null);
  const [importNotes, setImportNotes] = useState<{
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [selectedCard, setSelectedCard] = useState<YugiohCard | null>(null);
  const loadedIdRef = useRef<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  usePageView("page_view_deck_builder", deckId ? { deckId } : undefined);

  const handleSave = () => {
    const isNew = !deckId;
    save(deck);
    track("deck_saved", {
      deckId: deck.id,
      deckName: deck.name,
      main: stats.main,
      extra: stats.extra,
      side: stats.side,
    });
    if (isNew) {
      track("deck_created", { deckId: deck.id, deckName: deck.name });
    }
    setSaveStatus("saved");
    router.replace(`/deck-builder/${deck.id}`);
    window.setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleDrop = (card: YugiohCard, zone: DeckZone) => {
    addCard(card, zone);
    setSelectedCard(card);
  };

  const handleAdd = (card: YugiohCard, zone?: DeckZone) => {
    addCard(card, zone ?? getDefaultZoneForCard(card));
    setSelectedCard(card);
  };

  return (
    <DragDropProvider onDropOnZone={handleDrop}>
      <div className="flex h-full min-h-0">
        <CardDetailViewer
          card={selectedCard}
          className="w-[clamp(220px,22vw,280px)]"
          onSearchCards={() => searchInputRef.current?.focus()}
          onImportDeck={() => setIoMode("import")}
        />

        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DeckPanelHeader
            deckName={deck.name}
            onDeckNameChange={setDeckName}
            main={stats.main}
            extra={stats.extra}
            side={stats.side}
            saveStatus={saveStatus}
            onSave={handleSave}
            onClear={() => {
              resetDeck();
              setSelectedCard(null);
            }}
            onImport={() => setIoMode("import")}
            onExport={() => setIoMode("export")}
          />

          {ioMode && (
            <DeckIoDialog
              deck={deck}
              mode={ioMode}
              onClose={() => setIoMode(null)}
              onImport={(result) => {
                replaceDeck({
                  ...deck,
                  name: result.name?.trim() || deck.name,
                  main: result.main,
                  extra: result.extra,
                  side: result.side,
                });
                setImportNotes({ errors: result.errors, warnings: result.warnings });
                setSelectedCard(null);
              }}
            />
          )}

          {importNotes && (
            <ImportResultToast
              errors={importNotes.errors}
              warnings={importNotes.warnings}
              onClose={() => setImportNotes(null)}
            />
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col divide-y divide-(--color-border) border-b border-(--color-border)">
              <DeckZonePanel
                zone="main"
                entries={deck.main}
                deck={deck}
                onRemove={(id) => removeCard(id, "main")}
                onAdd={(card) => handleAdd(card, "main")}
                onSelectCard={setSelectedCard}
                selectedCardId={selectedCard?.id ?? null}
              />
              <DeckZonePanel
                zone="extra"
                entries={deck.extra}
                deck={deck}
                onRemove={(id) => removeCard(id, "extra")}
                onAdd={(card) => handleAdd(card, "extra")}
                onSelectCard={setSelectedCard}
                selectedCardId={selectedCard?.id ?? null}
              />
              <DeckZonePanel
                zone="side"
                entries={deck.side}
                deck={deck}
                onRemove={(id) => removeCard(id, "side")}
                onAdd={(card) => handleAdd(card, "side")}
                onSelectCard={setSelectedCard}
                selectedCardId={selectedCard?.id ?? null}
              />
            </div>
          </div>
        </section>

        <CardSearchPanel
          ref={searchInputRef}
          onAddCard={handleAdd}
          onSelectCard={setSelectedCard}
          selectedCardId={selectedCard?.id ?? null}
          className="w-[clamp(280px,28vw,380px)] shrink-0"
        />
      </div>
    </DragDropProvider>
  );
}
