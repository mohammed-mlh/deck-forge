import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/app", destination: "/deck-builder", permanent: true },
      { source: "/app/builder", destination: "/deck-builder", permanent: true },
      { source: "/app/my-decks", destination: "/decks", permanent: true },
      { source: "/app/settings", destination: "/deck-builder", permanent: true },
      { source: "/app/ai", destination: "/deck-builder", permanent: true },
      { source: "/get-started", destination: "/register", permanent: true },
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
