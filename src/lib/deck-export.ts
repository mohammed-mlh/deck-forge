import type { Deck, DeckCardEntry } from "@/types/deck";

function zoneLines(entries: DeckCardEntry[]): string {
  return entries
    .flatMap((e) => Array.from({ length: e.quantity }, () => e.card.name))
    .join("\n");
}

export function exportDeckToTxt(deck: Deck): string {
  return [
    "#main",
    zoneLines(deck.main),
    "",
    "#extra",
    zoneLines(deck.extra),
    "",
    "!side",
    zoneLines(deck.side),
  ].join("\n");
}

export function downloadDeckTxt(deck: Deck): void {
  const content = exportDeckToTxt(deck);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${deck.name.trim() || "deck"}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}
