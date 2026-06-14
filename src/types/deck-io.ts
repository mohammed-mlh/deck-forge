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
  main: import("@/types/deck").DeckCardEntry[];
  extra: import("@/types/deck").DeckCardEntry[];
  side: import("@/types/deck").DeckCardEntry[];
  errors: string[];
  warnings: string[];
}
