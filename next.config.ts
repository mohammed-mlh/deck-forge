import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/browse-decks", destination: "/app/decks", permanent: true },
      { source: "/browse-decks/prebuilt-:slug", destination: "/app/decks", permanent: true },
      { source: "/cards", destination: "/app/cards", permanent: true },
      { source: "/deck-builder", destination: "/app/deck-builder", permanent: true },
      { source: "/deck-builder/:id", destination: "/app/deck-builder/:id", permanent: true },
      { source: "/app/builder", destination: "/app/deck-builder", permanent: true },
      { source: "/app/builder/:id", destination: "/app/deck-builder/:id", permanent: true },
      { source: "/decks", destination: "/app/decks", permanent: true },
      { source: "/decks/:id", destination: "/app/decks/:id", permanent: true },
      { source: "/my-decks", destination: "/app/my-decks", permanent: true },
      { source: "/app", destination: "/app/cards", permanent: true },
      { source: "/get-started", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      { source: "/register", destination: "/", permanent: true },
      { source: "/sign-in", destination: "/", permanent: true },
      { source: "/sign-up", destination: "/", permanent: true },
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
