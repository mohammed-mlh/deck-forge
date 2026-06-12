import type { Deck, DeckCardEntry } from "@/types/deck";
import type { DeckFormatId } from "@/types/deck-io";
import { getDeckFormat } from "@/lib/deck-io/formats";

function expandIds(entries: DeckCardEntry[]): number[] {
  return entries.flatMap((e) => Array.from({ length: e.quantity }, () => e.card.id));
}

function expandNames(entries: DeckCardEntry[]): string[] {
  return entries.flatMap((e) => Array.from({ length: e.quantity }, () => e.card.name));
}

function zoneIdLines(entries: DeckCardEntry[]): string {
  return expandIds(entries).join("\n");
}

function zoneNameLines(entries: DeckCardEntry[]): string {
  return expandNames(entries).join("\n");
}

export function exportDeckToTxt(deck: Deck): string {
  return [
    "#main",
    zoneNameLines(deck.main),
    "",
    "#extra",
    zoneNameLines(deck.extra),
    "",
    "!side",
    zoneNameLines(deck.side),
  ].join("\n");
}

export function exportDeckToYdk(deck: Deck): string {
  return [
    "#main",
    zoneIdLines(deck.main),
    "",
    "#extra",
    zoneIdLines(deck.extra),
    "",
    "!side",
    zoneIdLines(deck.side),
  ].join("\n");
}

function encodeYdkeSection(entries: DeckCardEntry[]): string {
  const ids = expandIds(entries).join(",");
  if (!ids) return "";
  return btoa(ids);
}

export function exportDeckToYdke(deck: Deck): string {
  const main = encodeYdkeSection(deck.main);
  const extra = encodeYdkeSection(deck.extra);
  const side = encodeYdkeSection(deck.side);
  return `ydke://${main}!${extra}!${side}`;
}

export function exportDeckToJsonPortable(deck: Deck): string {
  const zone = (entries: DeckCardEntry[]) =>
    entries.map((e) => ({ id: e.card.id, quantity: e.quantity }));

  return JSON.stringify(
    {
      format: "deck-forge-portable-v1",
      name: deck.name,
      main: zone(deck.main),
      extra: zone(deck.extra),
      side: zone(deck.side),
    },
    null,
    2
  );
}

export function exportDeckToJsonFull(deck: Deck): string {
  return JSON.stringify(deck, null, 2);
}

function exportDelimited(deck: Deck, delimiter: string, header: boolean): string {
  const rows: string[] = header ? [`zone${delimiter}id${delimiter}name${delimiter}quantity`] : [];

  const addZone = (zone: string, entries: DeckCardEntry[]) => {
    for (const e of entries) {
      rows.push(
        [zone, String(e.card.id), `"${e.card.name.replace(/"/g, '""')}"`, String(e.quantity)].join(
          delimiter
        )
      );
    }
  };

  addZone("main", deck.main);
  addZone("extra", deck.extra);
  addZone("side", deck.side);
  return rows.join("\n");
}

export function exportDeckToCsv(deck: Deck): string {
  return exportDelimited(deck, ",", true);
}

export function exportDeckToTsv(deck: Deck): string {
  return exportDelimited(deck, "\t", true);
}

export function exportDeckToXml(deck: Deck): string {
  const zoneXml = (zone: string, entries: DeckCardEntry[]) => {
    const cards = entries
      .map(
        (e) =>
          `    <card id="${e.card.id}" name="${escapeXml(e.card.name)}" qty="${e.quantity}" />`
      )
      .join("\n");
    return `  <${zone}>\n${cards}\n  </${zone}>`;
  };

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<deck name="${escapeXml(deck.name)}">`,
    zoneXml("main", deck.main),
    zoneXml("extra", deck.extra),
    zoneXml("side", deck.side),
    "</deck>",
  ].join("\n");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function exportDeckToPlainIds(deck: Deck): string {
  return expandIds([...deck.main, ...deck.extra, ...deck.side]).join(", ");
}

export function exportDeckToPlainNames(deck: Deck): string {
  return expandNames(deck.main).join("\n");
}

export function exportDeck(deck: Deck, format: DeckFormatId): string {
  switch (format) {
    case "ygoprodeck-txt":
      return exportDeckToTxt(deck);
    case "ydk":
      return exportDeckToYdk(deck);
    case "ydke":
      return exportDeckToYdke(deck);
    case "json-portable":
      return exportDeckToJsonPortable(deck);
    case "json-full":
      return exportDeckToJsonFull(deck);
    case "csv":
      return exportDeckToCsv(deck);
    case "tsv":
      return exportDeckToTsv(deck);
    case "xml":
      return exportDeckToXml(deck);
    case "plain-ids":
      return exportDeckToPlainIds(deck);
    case "plain-names":
      return exportDeckToPlainNames(deck);
    default:
      return exportDeckToTxt(deck);
  }
}

export function downloadDeckExport(deck: Deck, format: DeckFormatId): void {
  const meta = getDeckFormat(format);
  const content = exportDeck(deck, format);
  const blob = new Blob([content], { type: meta.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${deck.name.trim() || "deck"}.${meta.extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
