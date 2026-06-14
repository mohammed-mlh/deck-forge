export interface ImportFormat {
  slug: string;
  name: string;
  description: string;
  extension?: string;
}

export const IMPORT_FORMATS: ImportFormat[] = [
  {
    slug: "ydk",
    name: "YDK",
    description:
      "Standard YGOPro / YGOProDeck deck file format. Upload or paste YDK exports from most simulators and deck sites.",
    extension: ".ydk",
  },
  {
    slug: "ydke",
    name: "YDKE",
    description:
      "Compact base64-encoded deck string popular for sharing in Discord and forums. Paste a YDKE URL or string directly.",
  },
  {
    slug: "ygoprodeck-txt",
    name: "YGOProDeck TXT",
    description:
      "Plain-text deck lists copied from YGOProDeck.com with section headers for Main, Extra, and Side decks.",
  },
  {
    slug: "json",
    name: "JSON",
    description:
      "Structured JSON deck exports from DeckForge and compatible tools. Best for programmatic backup and migration.",
    extension: ".json",
  },
  {
    slug: "csv",
    name: "CSV",
    description:
      "Spreadsheet-friendly comma-separated card lists with name and quantity columns.",
    extension: ".csv",
  },
  {
    slug: "xml",
    name: "XML",
    description:
      "Legacy XML deck list format supported by older Yu-Gi-Oh tools and some simulators.",
    extension: ".xml",
  },
];

export const IMPORT_PAGE_INTRO =
  "DeckForge accepts deck lists from most Yu-Gi-Oh tools. Open the deck builder, choose Import, then paste or upload your file. Card names resolve against the live YGOProDeck database.";
