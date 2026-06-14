import { slugify } from "@/lib/slug";

export interface SeoArchetype {
  slug: string;
  name: string;
  description: string;
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
