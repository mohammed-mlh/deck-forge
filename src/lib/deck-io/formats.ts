import type { DeckFormat, DeckFormatId } from "@/lib/deck-io/deck-io.schema";

export const DECK_FORMATS: DeckFormat[] = [
  {
    id: "ygoprodeck-txt",
    label: "YGOProDeck (.txt)",
    extension: "txt",
    mimeType: "text/plain",
    description: "Card names with #main / #extra / !side sections",
    importable: true,
    exportable: true,
  },
  {
    id: "ydk",
    label: "YDK (.ydk)",
    extension: "ydk",
    mimeType: "text/plain",
    description: "Card IDs with zone section markers",
    importable: true,
    exportable: true,
  },
  {
    id: "ydke",
    label: "YDKE URL",
    extension: "ydke",
    mimeType: "text/plain",
    description: "ydke:// base64-encoded ID lists (DuelingBook, EDOPro)",
    importable: true,
    exportable: true,
  },
  {
    id: "json-portable",
    label: "JSON (portable)",
    extension: "json",
    mimeType: "application/json",
    description: "IDs + quantities — works across apps",
    importable: true,
    exportable: true,
  },
  {
    id: "json-full",
    label: "JSON (full)",
    extension: "json",
    mimeType: "application/json",
    description: "Complete DeckForge deck with card data",
    importable: true,
    exportable: true,
  },
  {
    id: "csv",
    label: "CSV",
    extension: "csv",
    mimeType: "text/csv",
    description: "zone, id, name, quantity columns",
    importable: true,
    exportable: true,
  },
  {
    id: "tsv",
    label: "TSV",
    extension: "tsv",
    mimeType: "text/tab-separated-values",
    description: "Tab-separated zone, id, name, quantity",
    importable: true,
    exportable: true,
  },
  {
    id: "xml",
    label: "XML",
    extension: "xml",
    mimeType: "application/xml",
    description: "Simple deck XML with zone sections",
    importable: true,
    exportable: true,
  },
  {
    id: "plain-ids",
    label: "Plain IDs",
    extension: "ids",
    mimeType: "text/plain",
    description: "Comma or newline-separated card IDs (main deck)",
    importable: true,
    exportable: true,
  },
  {
    id: "plain-names",
    label: "Plain names",
    extension: "names",
    mimeType: "text/plain",
    description: "One card name per line (main deck)",
    importable: true,
    exportable: true,
  },
];

export function getDeckFormat(id: DeckFormatId): DeckFormat {
  const format = DECK_FORMATS.find((f) => f.id === id);
  if (!format) throw new Error(`Unknown format: ${id}`);
  return format;
}
