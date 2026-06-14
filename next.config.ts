import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/browse-decks", destination: "/decks", permanent: true },
      {
        source: "/browse-decks/prebuilt-:slug",
        destination: "/decks",
        permanent: true,
      },
      { source: "/app", destination: "/deck-builder", permanent: true },
      { source: "/app/builder", destination: "/deck-builder", permanent: true },
      { source: "/app/my-decks", destination: "/my-decks", permanent: true },
      { source: "/app/settings", destination: "/deck-builder", permanent: true },
      { source: "/app/ai", destination: "/deck-builder", permanent: true },
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
