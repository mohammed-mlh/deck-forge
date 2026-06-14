export interface SeoSection {
  heading: string;
  body: string;
}

export interface SeoGuide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  sections: SeoSection[];
  relatedLinks?: { label: string; href: string }[];
}

export const SEO_GUIDES: SeoGuide[] = [
  {
    slug: "yugioh-deck-building-guide",
    title: "Yu-Gi-Oh Deck Building Guide",
    description:
      "Learn how to build a competitive Yu-Gi-Oh deck from scratch — ratios, win conditions, Extra Deck planning, and testing tips.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Start with a win condition",
        body:
          "Every strong deck needs a clear path to victory. Pick an archetype or strategy first — combo, control, stun, or going-second OTK — then choose cards that support that plan. Avoid adding strong cards that do not advance your primary goal.",
      },
      {
        heading: "Build your core engine",
        body:
          "Most modern decks run 3 copies of their best starters and search cards. Include consistency pieces such as small-world bridges, generic draw/search spells, and hand traps that do not clash with your strategy. A typical Main Deck lands between 40 and 43 cards for TCG play.",
      },
      {
        heading: "Plan the Extra Deck carefully",
        body:
          "Your Extra Deck is limited to 15 monsters. Prioritize cards you actually summon in most games: link climbers, fusion targets, synchro lines, and XYZ options. Cut win-more cards that only appear in ideal hands.",
      },
      {
        heading: "Side Deck for matchups",
        body:
          "The Side Deck holds up to 15 cards swapped between games. Pack answers to popular strategies — board breakers, hand traps, and anti-meta tech. Side out dead cards against faster or slower decks.",
      },
      {
        heading: "Test and refine",
        body:
          "Goldfish your combos, then play against real decks. Track which cards underperform and adjust ratios. Use DeckForge to import lists, validate zone sizes, and run AI analysis on consistency and type balance.",
      },
    ],
    relatedLinks: [
      { label: "Main, Extra & Side explained", href: "/guides/main-extra-side-deck-explained" },
      { label: "Browse archetypes", href: "/archetypes" },
      { label: "Open deck builder", href: "/deck-builder" },
    ],
  },
  {
    slug: "main-extra-side-deck-explained",
    title: "Main, Extra & Side Deck Explained",
    description:
      "What goes in each Yu-Gi-Oh deck zone? Main Deck monsters and spells, Extra Deck fusion/synchro/xyz/link, and Side Deck tech options.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Main Deck",
        body:
          "The Main Deck holds monsters, spells, and traps you draw during the game. Standard TCG decks contain 40 to 60 cards, with 40 being most common for consistency. Normal, Effect, Ritual, and Pendulum monsters live here unless their summoning method sends them elsewhere.",
      },
      {
        heading: "Extra Deck",
        body:
          "Fusion, Synchro, Xyz, and Link Monsters are stored in the Extra Deck — up to 15 cards. You do not draw from this zone; you summon from it using the correct materials. Many strategies dedicate most Extra Deck slots to one- or two-card combo lines.",
      },
      {
        heading: "Side Deck",
        body:
          "Between duels in a match, you may swap cards from your Side Deck with Main or Extra Deck cards. Side Deck size is 0 to 15. It is your toolkit for adapting to the meta without bloating your main strategy.",
      },
    ],
    relatedLinks: [
      { label: "Deck size and limits", href: "/guides/yugioh-deck-size-and-limits" },
      { label: "Extra Deck monster types", href: "/guides/yugioh-extra-deck-monsters-explained" },
    ],
  },
  {
    slug: "yugioh-deck-size-and-limits",
    title: "Yu-Gi-Oh Deck Size and Copy Limits",
    description:
      "Official Yu-Gi-Oh deck size rules: 40–60 Main Deck, 15 Extra, 15 Side, and the 3-copy limit for most cards.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Deck sizes",
        body:
          "Main Deck: minimum 40, maximum 60 cards. Extra Deck: exactly 0 to 15 monsters. Side Deck: exactly 0 to 15 cards. In official TCG events you must meet these limits before a duel.",
      },
      {
        heading: "Copy limits",
        body:
          "You may include at most three copies of any individual card across Main + Side combined (Extra Deck monsters also count toward the three-of limit for that card name). Semi-Limited and Limited cards on the Forbidden & Limited list allow two or one copy instead.",
      },
      {
        heading: "Validation in DeckForge",
        body:
          "The DeckForge builder enforces zone sizes and copy limits automatically. Invalid decks show errors before you save or export, so you can fix issues before testing or sharing a list.",
      },
    ],
    relatedLinks: [{ label: "Build a deck", href: "/deck-builder" }],
  },
  {
    slug: "how-to-import-yugioh-decks",
    title: "How to Import Yu-Gi-Oh Decks",
    description:
      "Import YDK, YDKE, YGOProDeck TXT, JSON, and more into DeckForge. Paste or upload deck lists from other tools.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Supported formats",
        body:
          "DeckForge supports YDK, YDKE, YGOProDeck export text, JSON, CSV, XML, and several other community formats. Open the deck builder, use Import, then paste or upload your file.",
      },
      {
        heading: "From YGOProDeck",
        body:
          "Copy a deck list from YGOProDeck as text or download YDK. Paste directly into DeckForge — card names resolve against the live database. Missing or alternate-art names may need manual fixes.",
      },
      {
        heading: "Export and share",
        body:
          "After editing, export in the same formats to share with friends or post online. Public decks on DeckForge get their own shareable page in the community gallery.",
      },
    ],
    relatedLinks: [
      { label: "Import format reference", href: "/import" },
      { label: "Open deck builder", href: "/deck-builder" },
    ],
  },
  {
    slug: "yugioh-extra-deck-monsters-explained",
    title: "Extra Deck Monsters Explained",
    description:
      "Fusion, Synchro, Xyz, and Link Monsters — how each Extra Deck summoning method works in Yu-Gi-Oh.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Fusion Monsters",
        body:
          "Fusion Monsters are summoned by combining specific materials listed on the card, usually with a Polymerization-style effect or archetype-specific fusion spell. Materials are often sent from the field or hand to the graveyard.",
      },
      {
        heading: "Synchro Monsters",
        body:
          "Synchro Summons add the levels of a Tuner and non-Tuner monsters to match the Synchro Monster's level. Materials are sent to the graveyard. Synchro-focused decks often run multiple levels for flexible lines.",
      },
      {
        heading: "Xyz Monsters",
        body:
          "Xyz Summons overlay two or more monsters of the same level. Materials become attached Xyz units rather than going to the graveyard. Rank — not level — determines legal targets.",
      },
      {
        heading: "Link Monsters",
        body:
          "Link Monsters have a Link Rating instead of DEF. Summon them by sending face-up monsters to the graveyard equal to the Link Rating. Link Arrows determine where extra monsters can be summoned from.",
      },
    ],
    relatedLinks: [{ label: "Search all cards", href: "/cards" }],
  },
  {
    slug: "what-is-a-yugioh-archetype",
    title: "What Is a Yu-Gi-Oh Archetype?",
    description:
      "Archetypes are groups of cards that share a name and synergize together. Learn how archetypes shape deck building and where to browse them on DeckForge.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Definition",
        body:
          "An archetype is a family of cards whose names include the same term — for example, \"Blue-Eyes\" or \"Sky Striker\". Archetype support cards only work with members of that family, creating cohesive strategies.",
      },
      {
        heading: "Pure vs hybrid decks",
        body:
          "Pure decks use mostly one archetype. Hybrid decks mix two or more engines that do not interfere with each other — such as a main archetype plus generic hand traps or a small splash engine.",
      },
      {
        heading: "Browse on DeckForge",
        body:
          "Use archetype pages to see key cards and open the card browser filtered by that archetype. Combine archetype research with the deck builder and community lists to prototype faster.",
      },
    ],
    relatedLinks: [
      { label: "Archetype directory", href: "/archetypes" },
      { label: "Deck building guide", href: "/guides/yugioh-deck-building-guide" },
    ],
  },
];

export function getGuide(slug: string): SeoGuide | undefined {
  return SEO_GUIDES.find((guide) => guide.slug === slug);
}

export function getGuideSlugs(): string[] {
  return SEO_GUIDES.map((guide) => guide.slug);
}
