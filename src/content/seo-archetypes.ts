import { slugify } from "@/lib/slug";

export interface SeoArchetype {
  slug: string;
  name: string;
  description: string;
  featuredCardName: string;
  tags: string[];
  overview: SeoSection[];
  keyCardNames: string[];
  relatedSlugs: string[];
}

export interface SeoSection {
  heading: string;
  body: string;
}

export const FEATURED_ARCHETYPES: SeoArchetype[] = [
  {
    slug: "blue-eyes",
    name: "Blue-Eyes",
    description:
      "Blue-Eyes White Dragon and its support — high-ATK beatdown, ritual and synchro lines, and classic Dragon toolbox strategies.",
    featuredCardName: "Blue-Eyes White Dragon",
    tags: ["Beatdown", "Ritual", "Synchro"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Blue-Eyes decks pressure the board with large monsters and explosive turns. Modern lists combine the classic White Dragon engine with ritual and synchro payoffs, using search spells and tuners to rebuild after disruption.",
      },
      {
        heading: "Key strengths",
        body:
          "High damage output, strong going second with board breakers, and iconic cards that benefit from generic Dragon support. Many builds can play through one interaction when hands are strong.",
      },
      {
        heading: "Deck building tips",
        body:
          "Run 2–3 copies of Blue-Eyes White Dragon and lean on Sage with Eyes of Blue for consistency. Spirit Dragon and its tag-out lines provide interruption going first. Pair the core with hand traps and generic Dragon extenders for resilience.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Brick-heavy hands without a starter, vulnerability to non-destruction removal, and reliance on the Extra Deck — Ash Blossom and Infinite Impermanence can stall key turns if you cannot extend.",
      },
    ],
    keyCardNames: [
      "Blue-Eyes White Dragon",
      "Blue-Eyes Alternative White Dragon",
      "Sage with Eyes of Blue",
      "Maiden with Eyes of Blue",
      "Blue-Eyes Spirit Dragon",
    ],
    relatedSlugs: ["dark-magician", "tenpai-dragon"],
  },
  {
    slug: "dark-magician",
    name: "Dark Magician",
    description:
      "The classic Spellcaster ace — Dark Magician fusion lines, Eternal Soul traps, and Magician Girl synergies.",
    featuredCardName: "Dark Magician",
    tags: ["Fusion", "Control", "Grind"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Dark Magician strategies mix fusion climbing with trap-based disruption. Rod and other searchers consolidate the deck while fusions provide removal and recursion from the Extra Deck.",
      },
      {
        heading: "Key strengths",
        body:
          "Flexible trap package, strong grind game, and fusion bodies that protect the field. Hybrid Magician Girl builds add extra consistency and rank plays.",
      },
      {
        heading: "Deck building tips",
        body:
          "Magician of Dark Illusion and Dark Magical Circle form the search core. Eternal Soul protects the field and revives Dark Magician repeatedly. Consider Magician Girls for extra bodies and rank 6 plays.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Slower than modern combo decks, vulnerable to cards that banish or bounce back-row, and can struggle going second without board breakers in hand.",
      },
    ],
    keyCardNames: [
      "Dark Magician",
      "Magician of Dark Illusion",
      "Dark Magical Circle",
      "Eternal Soul",
      "Red-Eyes Dark Dragoon",
    ],
    relatedSlugs: ["blue-eyes", "hero"],
  },
  {
    slug: "sky-striker",
    name: "Sky Striker",
    description:
      "Link-based control that uses spells to summon Ace monsters from the Extra Deck — efficient, interactive, and meta-resilient.",
    featuredCardName: "Sky Striker Ace - Raye",
    tags: ["Control", "Link", "Spell-heavy"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Sky Striker runs few monsters and many spells. Link summon Kagari or Shizuku, then grind with Engage, Hornet Drones, and Afterburners. The deck excels at trading resources and outvaluing slower strategies.",
      },
      {
        heading: "Key strengths",
        body:
          "Minimal normal summon reliance, strong going first and second, and efficient spell engine that fits hand trap density. Extra Deck is compact and predictable.",
      },
      {
        heading: "Deck building tips",
        body:
          "Three Engage and three Hornet Drones are staples. Raye is your only normal summon — protect her. Multirole recycles spells and sets up follow-up. Side heavily into going-second cards for combo matchups.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Spell-heavy lists lose to Anti-Spell Fragrance and Imperial Order. Low monster count makes you weak to Nibiru after long combo lines. Requires precise resource management across multiple turns.",
      },
    ],
    keyCardNames: [
      "Sky Striker Mobilize - Engage!",
      "Sky Striker Mecha - Hornet Drones",
      "Sky Striker Ace - Raye",
      "Sky Striker Ace - Kagari",
      "Sky Striker Mecha Modules - Multirole",
    ],
    relatedSlugs: ["trickstar", "orcust"],
  },
  {
    slug: "branded",
    name: "Branded",
    description:
      "Despia and Branded fusion control — Alba System, mirrorjade lines, and fusion toolbox strategies.",
    featuredCardName: "Mirrorjade the Iceblade Dragon",
    tags: ["Fusion", "Control", "Grind"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Branded decks fuse frequently, sending materials to set up graveyard effects and fusion summoning Albaz lines. Control boards with Mirrorjade and follow up with fusion recursion and branded spells.",
      },
      {
        heading: "Key strengths",
        body:
          "Strong fusion engine, good grind game, and flexible Extra Deck that adapts to many matchups when built with generic fusion support.",
      },
      {
        heading: "Deck building tips",
        body:
          "Aluber and Branded Opening are your primary starters. Fallen of Albaz fuses with opponent monsters for disruption. Branded in Red and Branded Beast provide follow-up from the graveyard.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Fusion-heavy lines are weak to Dimensional Fissure and banish effects. Mirrorjade requires setup — if Aluber is negated early, the turn can end with minimal payoff.",
      },
    ],
    keyCardNames: [
      "Aluber the Jester of Despia",
      "Fallen of Albaz",
      "Branded Fusion",
      "Mirrorjade the Iceblade Dragon",
      "Branded in Red",
    ],
    relatedSlugs: ["eldlich", "snake-eye"],
  },
  {
    slug: "kashtira",
    name: "Kashtira",
    description:
      "Xyz control that manipulates face-down cards and shuts down extra deck strategies.",
    featuredCardName: "Kashtira Unicorn",
    tags: ["Control", "Xyz", "Extra Deck hate"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Kashtira summons Rank 7 Xyz monsters that flip opponents' cards face-down and restrict special summons. The deck wins by slowing the opponent while building an unanswerable board of Unicorn and Fenrir.",
      },
      {
        heading: "Key strengths",
        body:
          "Powerful going-first boards, extra deck hate, and pressure that punishes decks relying on multiple special summons from the Extra Deck.",
      },
      {
        heading: "Deck building tips",
        body:
          "Unicorn and Fenrir are the core bosses — both flip cards face-down and banish from the Extra Deck. Kashtira Birth searches and sets up follow-up. Run hand traps to protect your board once established.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Struggles going second without specific side deck cards. Pure Kashtira can brick if Birth or Unicorn are negated. Less effective against decks with few Extra Deck dependencies.",
      },
    ],
    keyCardNames: [
      "Kashtira Unicorn",
      "Kashtira Fenrir",
      "Kashtira Birth",
      "Kashtira Big Bang",
      "Kashtiratheosis",
    ],
    relatedSlugs: ["eldlich", "branded"],
  },
  {
    slug: "eldlich",
    name: "Eldlich",
    description:
      "Golden Lord trap control — set continuous traps, grind with Eldlixir spells, and summon high-rank xyz bosses.",
    featuredCardName: "Eldlich the Golden Lord",
    tags: ["Control", "Trap", "Grind"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Eldlich wins by setting multiple trap cards and summoning Eldlich the Golden Lord. The deck is slow but resilient, generating advantage from the graveyard and chaining eldlixir effects.",
      },
      {
        heading: "Key strengths",
        body:
          "Excellent grind game, strong trap density, and simple lines that are easy to learn. Side deck space adapts well to combo and control matchups.",
      },
      {
        heading: "Deck building tips",
        body:
          "Golden Land traps form the backbone — each one triggers Eldlich effects from the graveyard. Eldlixir spells summon Eldlich and send traps for value. Conductor of Nephthys adds extra recursion.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Slow setup vulnerable to going second without board breakers. Heavy trap reliance makes you weak to Royal Decree and Harpie's Feather Duster. Can struggle to close games quickly.",
      },
    ],
    keyCardNames: [
      "Eldlich the Golden Lord",
      "Golden Land Forever!",
      "Eldlixir of White Destiny",
      "Conductor of Nephthys",
      "Eldlich Lordran's Paradise",
    ],
    relatedSlugs: ["kashtira", "branded"],
  },
  {
    slug: "snake-eye",
    name: "Snake-Eye",
    description:
      "Link and fusion hybrid that places monsters in spell zones and builds explosive boards.",
    featuredCardName: "Snake-Eye Ash",
    tags: ["Combo", "Link", "Hybrid"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Snake-Eye engines use Flamberge and Oak to place monsters in spell/trap zones, enabling link climbs and fusion plays. Lists often splash small engines for extra consistency.",
      },
      {
        heading: "Key strengths",
        body:
          "High ceiling turns, flexible link lines, and strong interaction when combined with branded or fiendsmith-style engines in hybrid builds.",
      },
      {
        heading: "Deck building tips",
        body:
          "Ash and Oak are the primary starters — Ash searches and Oak places monsters in spell zones. Flamberge Dragon is the main boss with pop and protection effects. Hybrid builds splash 6–10 cards from a second engine.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Complex lines require practice. Vulnerable to cards that destroy spell/trap zones. Hybrid builds reduce consistency if the non-Snake-Eye engine is cut by hand traps.",
      },
    ],
    keyCardNames: [
      "Snake-Eye Ash",
      "Snake-Eye Oak",
      "Snake-Eye Flamberge Dragon",
      "Original Sinful Spoils - Snake-Eye",
      "Poplar of the White Forest",
    ],
    relatedSlugs: ["branded", "tenpai-dragon"],
  },
  {
    slug: "tenpai-dragon",
    name: "Tenpai Dragon",
    description:
      "Synchro and pendulum Dragon combo — Chixiao lines, flexible levels, and OTK potential.",
    featuredCardName: "Tenpai Dragon Chixiao",
    tags: ["Synchro", "Combo", "OTK"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Tenpai Dragon focuses on synchro summoning using tuners like Adra and payoffs like Chixiao. The deck can play control or push for lethal when going second.",
      },
      {
        heading: "Key strengths",
        body:
          "Compact engine, strong synchro toolbox, and synergy with generic Dragon support and hand traps.",
      },
      {
        heading: "Deck building tips",
        body:
          "Adra and Paidra are core starters that search and summon. Chixiao provides negation going first and damage going second. Sangen spells extend combos and fix hands.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Relies on synchro climbing — Solemn Strike and Ghost Ogre can interrupt key steps. Smaller card pool than older archetypes means fewer backup lines when starters are stopped.",
      },
    ],
    keyCardNames: [
      "Tenpai Dragon Chixiao",
      "Tenpai Dragon Adra",
      "Tenpai Dragon Paidra",
      "Sangen Summoning",
      "Tenpai Dragon Fadra",
    ],
    relatedSlugs: ["blue-eyes", "snake-eye"],
  },
  {
    slug: "mathmech",
    name: "Mathmech",
    description:
      "Cyberse synchro combo — Circular, Alembertian, and OTK lines built around level 4 monsters.",
    featuredCardName: "Mathmech Circular",
    tags: ["Combo", "Synchro", "OTK"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Mathmech starts with level 4 Cyberse monsters and Circular to dump the deck and synchro climb into Alembertian or Laplacian. Many builds splash small engines for extra extenders.",
      },
      {
        heading: "Key strengths",
        body:
          "One-card combos, strong disruption on Alembertian, and high OTK damage when lines resolve fully.",
      },
      {
        heading: "Deck building tips",
        body:
          "Circular is the best one-card starter — it dumps Sigma and searches Superfactorial. Alembertian omni-negates and searches on summon. Diameter protects your synchro plays from destruction.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Circular is limited to one copy — drawing it is essential. Nibiru after Alembertian summon is a common blowout. Ash Blossom on Circular ends the turn with no follow-up.",
      },
    ],
    keyCardNames: [
      "Mathmech Circular",
      "Mathmech Diameter",
      "Mathmech Alembertian",
      "Mathmech Superfactorial",
      "Cynet Mining",
    ],
    relatedSlugs: ["hero", "sky-striker"],
  },
  {
    slug: "hero",
    name: "HERO",
    description:
      "Elemental HERO fusion aggro — search spells, Miracle Fusion, and masked HERO transformation plays.",
    featuredCardName: "Elemental HERO Stratos",
    tags: ["Fusion", "Aggro", "OTK"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "HERO decks search fusion pieces with Stratos and Shadow Mist, then fuse into high-impact monsters like Sunrise or Absolute Zero. Masked HERO provides fast OTK lines from the Extra Deck.",
      },
      {
        heading: "Key strengths",
        body:
          "Explosive damage, flexible fusion toolbox, and strong going-second potential with board breakers and direct fusion lines.",
      },
      {
        heading: "Deck building tips",
        body:
          "Stratos and Shadow Mist are the search core. Miracle Fusion recurs from the graveyard for surprise fusions. Masked HERO Dark Law shuts down search effects and is a common side deck option.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Fusion-dependent — cards like Anti-Fusion Device and Dimensional Fissure hurt badly. Multi-card OTK lines fail if any fusion step is negated. Brick risk with too many high-level HERO monsters.",
      },
    ],
    keyCardNames: [
      "Elemental HERO Stratos",
      "Elemental HERO Shadow Mist",
      "Miracle Fusion",
      "Elemental HERO Sunrise",
      "Masked HERO Dark Law",
    ],
    relatedSlugs: ["dark-magician", "mathmech"],
  },
  {
    slug: "orcust",
    name: "Orcust",
    description:
      "Link and xyz machine control — Galatea, Babel, and long combo lines into Dingirsu.",
    featuredCardName: "Galatea, the Orcust Automaton",
    tags: ["Control", "Link", "Grind"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Orcust sends monsters to the graveyard to summon Galatea and link into Babel for infinite grind value. The deck sets up multiple interruptions when combos resolve.",
      },
      {
        heading: "Key strengths",
        body:
          "Strong resource loop, excellent grind game, and hybrid capability with engines like World Legacy or Danger.",
      },
      {
        heading: "Deck building tips",
        body:
          "Harp Horror and Knightmare send Orcust cards to the graveyard. Galatea searches and sets up link climbs. Babel gives all Orcust monsters quick effects. Dingirsu provides non-targeting removal.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Long combo lines are vulnerable to Nibiru and Droll & Lock Bird. Banish effects shut down the graveyard engine. Requires multiple cards for full board — weak to multiple hand traps.",
      },
    ],
    keyCardNames: [
      "Orcust Knightmare",
      "Orcust Harp Horror",
      "Galatea, the Orcust Automaton",
      "Orcust Babel",
      "Dingirsu, the Orcust of the Evening Star",
    ],
    relatedSlugs: ["sky-striker", "trickstar"],
  },
  {
    slug: "trickstar",
    name: "Trickstar",
    description:
      "Link burn and control — Lycoris damage, live stage traps, and aggressive link climbing.",
    featuredCardName: "Trickstar Lycoris",
    tags: ["Burn", "Link", "Control"],
    overview: [
      {
        heading: "Playstyle",
        body:
          "Trickstar deals incremental burn damage while building link monsters. Light Stage and live stage variants lock opponents out of spell/trap zones while chipping life points.",
      },
      {
        heading: "Key strengths",
        body:
          "Fast damage clock, simple link lines, and strong hybrid potential with Sky Striker or other spell-heavy engines.",
      },
      {
        heading: "Deck building tips",
        body:
          "Lycoris and Lilybell form the burn core — Lycoris redirects damage to the opponent. Light Stage searches live stage cards and locks zones. Holly Angel protects your link monsters.",
      },
      {
        heading: "Common weaknesses",
        body:
          "Burn strategy is slow against high-LP recovery decks. Light Stage dependency makes you weak to MST and Cosmic Cyclone. Limited interaction without hybrid engines.",
      },
    ],
    keyCardNames: [
      "Trickstar Lilybell",
      "Trickstar Lycoris",
      "Trickstar Light Stage",
      "Trickstar Holly Angel",
      "Trickstar Reincarnation",
    ],
    relatedSlugs: ["sky-striker", "orcust"],
  },
];

export function getFeaturedArchetype(slug: string): SeoArchetype | undefined {
  return FEATURED_ARCHETYPES.find((archetype) => archetype.slug === slug);
}

export function getFeaturedArchetypeSlugs(): string[] {
  return FEATURED_ARCHETYPES.map((archetype) => archetype.slug);
}

export function buildGenericArchetype(name: string): SeoArchetype {
  return {
    slug: slugify(name),
    name,
    description: `Browse ${name} Yu-Gi-Oh cards, deck ideas, and related strategies on DeckForge.`,
    featuredCardName: name,
    tags: [],
    overview: [
      {
        heading: `About ${name}`,
        body:
          `${name} is a Yu-Gi-Oh archetype — a group of cards that share the "${name}" name and work together. Browse key cards below, filter the full database by this archetype, and explore public decks for inspiration.`,
      },
    ],
    keyCardNames: [],
    relatedSlugs: [],
  };
}
