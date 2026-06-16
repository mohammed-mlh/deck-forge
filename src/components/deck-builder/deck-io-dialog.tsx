"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Upload, X } from "lucide-react";
import {
  DECK_FORMATS,
  detectDeckFormat,
  downloadDeckExport,
  exportDeck,
  parseDeckContent,
  resolveParsedDeck,
} from "@/lib/deck-io";
import type { DeckFormatId } from "@/lib/deck-io";
import { tryImportJsonFullDeck } from "@/lib/deck-io/resolve";
import type { Deck } from "@/features/decks/decks.schema";
import { cn } from "@/lib/utils";

interface DeckIoDialogProps {
  deck: Deck;
  mode: "import" | "export";
  onClose: () => void;
  onImport: (result: {
    name?: string;
    main: Deck["main"];
    extra: Deck["extra"];
    side: Deck["side"];
    errors: string[];
    warnings: string[];
  }) => void;
}

export function DeckIoDialog({ deck, mode, onClose, onImport }: DeckIoDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importFormat, setImportFormat] = useState<DeckFormatId>("ygoprodeck-txt");
  const [exportFormat, setExportFormat] = useState<DeckFormatId>("ygoprodeck-txt");
  const [paste, setPaste] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const preview = useMemo(
    () => exportDeck(deck, exportFormat),
    [deck, exportFormat]
  );

  const handleImportFile = async (file: File) => {
    try {
      const content = await file.text();
      const format = detectDeckFormat(content, file.name);
      setImportFormat(format);
      setPaste(content);
      setMessage(`Detected: ${DECK_FORMATS.find((f) => f.id === format)?.label ?? format}`);
    } catch {
      setMessage("Could not read file. Try again.");
    }
  };

  const handleImport = async () => {
    if (!paste.trim()) {
      setMessage("Paste deck data or choose a file.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let result = tryImportJsonFullDeck(paste);

      if (!result) {
        const parsed = parseDeckContent(paste, importFormat);
        result = await resolveParsedDeck(parsed);
      }

      onImport(result);
      onClose();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-(--color-border) bg-(--color-bg-elevated) shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
          <h2 className="text-sm font-semibold text-(--color-foreground)">
            {mode === "import" ? "Import Deck" : "Export Deck"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-(--color-foreground-muted) hover:bg-(--color-surface-2)"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto p-4">
          <select
            value={mode === "import" ? importFormat : exportFormat}
            onChange={(e) => {
              const id = e.target.value as DeckFormatId;
              if (mode === "import") setImportFormat(id);
              else setExportFormat(id);
            }}
            className="h-9 rounded-md border border-(--color-border) bg-(--color-surface-2) px-2 text-sm text-(--color-foreground)"
          >
            {DECK_FORMATS.filter((f) => (mode === "import" ? f.importable : f.exportable)).map(
              (f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              )
            )}
          </select>

          <p className="text-xs text-(--color-foreground-subtle)">
            {DECK_FORMATS.find((f) => f.id === (mode === "import" ? importFormat : exportFormat))
              ?.description}
          </p>

          {mode === "import" ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.ydk,.ydke,.json,.csv,.tsv,.xml,.ids,.names"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImportFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-sm text-(--color-foreground-muted) hover:bg-(--color-surface-3)"
              >
                <Upload className="size-4" />
                Choose file
              </button>
              <textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder="Or paste deck data here…"
                rows={10}
                className="min-h-[160px] resize-y rounded-md border border-(--color-border) bg-(--color-surface-2) p-3 font-mono text-xs text-(--color-foreground) outline-none focus:border-(--color-border-focus)"
              />
              <button
                type="button"
                onClick={() => void handleImport()}
                disabled={loading}
                className={cn(
                  "rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) hover:bg-(--color-primary-hover)",
                  loading && "opacity-60"
                )}
              >
                {loading ? "Resolving cards…" : "Import"}
              </button>
            </>
          ) : (
            <>
              <textarea
                readOnly
                value={preview}
                rows={12}
                className="min-h-[200px] resize-y rounded-md border border-(--color-border) bg-(--color-surface-2) p-3 font-mono text-xs text-(--color-foreground)"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-sm text-(--color-foreground-muted) hover:bg-(--color-surface-3)"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadDeckExport(deck, exportFormat)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-(--color-primary) px-3 py-2 text-sm font-medium text-(--color-primary-foreground) hover:bg-(--color-primary-hover)"
                >
                  <Download className="size-4" />
                  Download
                </button>
              </div>
            </>
          )}

          {message && (
            <p className="text-xs text-(--color-foreground-muted)">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
