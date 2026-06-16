import type { DeckCardEntry } from "@/features/decks/decks.schema";

export const DECK_GRID_COLUMNS = 10;

export interface DeckSlot {
  entry: DeckCardEntry;
  copyIndex: number;
}

export function entriesToSlots(entries: DeckCardEntry[]): DeckSlot[] {
  const slots: DeckSlot[] = [];
  for (const entry of entries) {
    for (let i = 0; i < entry.quantity; i++) {
      slots.push({ entry, copyIndex: i });
    }
  }
  return slots;
}

export function buildSlotGrid<T>(filled: T[], capacity: number): (T | null)[] {
  const grid: (T | null)[] = filled.map((item) => item);
  while (grid.length < capacity) grid.push(null);
  return grid.slice(0, capacity);
}
