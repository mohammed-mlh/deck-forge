"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { DragDropProvider } from "@/components/deck-builder/drag-drop-provider";
import { CardDetailViewer } from "@/components/deck-builder/card-detail-viewer";
import { CardSearchPanel } from "@/components/deck-builder/card-search-panel";
import { DeckZonePanel } from "@/components/deck-builder/deck-zone";
import { DeckIoDialog } from "@/components/deck-builder/deck-io-dialog";
import { DeckPanelHeader } from "@/components/deck-builder/deck-panel-header";
import { DeckBuilderSkeleton } from "@/components/ui/loading-skeleton";
import { useDeck } from "@/hooks/use-deck";
import { useSavedDecks } from "@/hooks/use-saved-decks";
import { track } from "@/lib/analytics";
import { usePageView } from "@/hooks/use-page-view";
import { getDefaultZoneForCard } from "@/lib/deck-rules";
import type { DeckZone, SavedDeck } from "@/types/deck";
import type { YugiohCard } from "@/types/yugioh";

function DeckNotFound() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-lg font-semibold text-(--color-foreground)">Deck not found</h2>
      <p className="max-w-sm text-sm text-(--color-foreground-muted)">
        This deck may have been deleted or the link is invalid.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/deck-builder"
          className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
        >
          New deck
        </Link>
        <Link
          href="/my-decks"
          className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
        >
          My Decks
        </Link>
      </div>
    </div>
  );
}

function ImportResultToast({
  errors,
  warnings,
  onClose,
}: {
  errors: string[];
  warnings: string[];
  onClose: () => void;
}) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 max-h-40 overflow-y-auto rounded-lg border border-(--color-border) bg-(--color-surface-1) p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-(--color-foreground)">
          {errors.length > 0 ? "Import completed with issues" : "Import notes"}
        </span>
        <button type="button" onClick={onClose} className="text-(--color-foreground-muted)">
          <X className="size-3.5" />
        </button>
      </div>
      <ul className="space-y-1 text-xs text-(--color-foreground-muted)">
        {warnings.map((w) => (
          <li key={w} className="text-(--color-warning)">
            {w}
          </li>
        ))}
        {errors.length > 0 && (
          <li className="font-medium text-(--color-danger)">Unresolved cards:</li>
        )}
        {errors.slice(0, 8).map((e) => (
          <li key={e} className="pl-2 text-(--color-danger)">
            {e}
          </li>
        ))}
        {errors.length > 8 && (
          <li className="text-(--color-foreground-subtle)">+{errors.length - 8} more</li>
        )}
      </ul>
    </div>
  );
}

interface DeckBuilderContentProps {
  deckId: string | null;
  initialDeck?: SavedDeck;
}

function DeckBuilderContent({ deckId, initialDeck }: DeckBuilderContentProps) {
  const router = useRouter();
  const { save } = useSavedDecks();
  const { deck, stats, addCard, removeCard, resetDeck, setDeckName, replaceDeck } =
    useDeck(initialDeck);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [ioMode, setIoMode] = useState<"import" | "export" | null>(null);
  const [importNotes, setImportNotes] = useState<{
    errors: string[];
    warnings: string[];
  } | null>(null);
  const [selectedCard, setSelectedCard] = useState<YugiohCard | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

export function DeckBuilder() {
  const params = useParams();
  const deckId = typeof params.id === "string" ? params.id : null;
  const { ready, getById } = useSavedDecks();

  if (deckId && !ready) {
    return <DeckBuilderSkeleton />;
  }

  const savedDeck = deckId && ready ? getById(deckId) : undefined;

  if (deckId && ready && !savedDeck) {
    return <DeckNotFound />;
  }

  return (
    <DeckBuilderContent
      key={deckId ?? "new"}
      deckId={deckId}
      initialDeck={savedDeck}
    />
  );
}
