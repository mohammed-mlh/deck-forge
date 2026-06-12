import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/browse-decks", destination: "/decks", permanent: true },
      {
        source: "/browse-decks/prebuilt-blue-eyes",
        destination: "/decks/blue-eyes-chronicle",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-dark-magician",
        destination: "/decks/dark-magician-legacy",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-sky-striker",
        destination: "/decks/sky-striker-mobilize",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-eldlich",
        destination: "/decks/eldlich-golden",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-stardust",
        destination: "/decks/stardust-synchron",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-blackwing",
        destination: "/decks/blackwing-assault",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-utopia",
        destination: "/decks/utopia-rising",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-photon",
        destination: "/decks/photon-galaxy",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-odd-eyes",
        destination: "/decks/odd-eyes-pendulum",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-raidraptor",
        destination: "/decks/raid-raptors-strike",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-salamangreat",
        destination: "/decks/salamangreat-blaze",
        permanent: true,
      },
      {
        source: "/browse-decks/prebuilt-rokket",
        destination: "/decks/rokket-reload",
        permanent: true,
      },
      { source: "/app", destination: "/deck-builder", permanent: true },
      { source: "/app/builder", destination: "/deck-builder", permanent: true },
      { source: "/app/my-decks", destination: "/my-decks", permanent: true },
      { source: "/app/settings", destination: "/deck-builder", permanent: true },
      { source: "/app/ai", destination: "/deck-builder", permanent: true },
      { source: "/get-started", destination: "/sign-up", permanent: true },
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/sign-up", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ygoprodeck.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
