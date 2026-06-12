import type { Deck } from "@/types/deck";
import { downloadDeckExport, exportDeckToTxt } from "@/lib/deck-io";

/** @deprecated Use downloadDeckExport(deck, "ygoprodeck-txt") */
export { exportDeckToTxt };

/** @deprecated Use downloadDeckExport(deck, "ygoprodeck-txt") */
export function downloadDeckTxt(deck: Deck): void {
  downloadDeckExport(deck, "ygoprodeck-txt");
}
