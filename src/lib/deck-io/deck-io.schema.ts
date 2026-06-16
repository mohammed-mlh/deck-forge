import type { DeckCardEntry } from "@/features/decks/decks.schema";

export type DeckFormatId =
  | "ygoprodeck-txt"
  | "ydk"
  | "ydke"
  | "json-portable"
  | "json-full"
  | "csv"
  | "tsv"
  | "xml"
  | "plain-ids"
  | "plain-names";

export interface DeckFormat {
  id: DeckFormatId;
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  importable: boolean;
  exportable: boolean;
}

export interface ParsedCardRef {
  id?: number;
  name?: string;
  quantity: number;
}

export interface ParsedDeckList {
  name?: string;
  main: ParsedCardRef[];
  extra: ParsedCardRef[];
  side: ParsedCardRef[];
}

export interface ImportResult {
  name?: string;
  main: DeckCardEntry[];
  extra: DeckCardEntry[];
  side: DeckCardEntry[];
  errors: string[];
  warnings: string[];
}
