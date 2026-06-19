import type { Metadata } from "next";

const SITE_NAME = "DeckForge";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  robots,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  robots?: Metadata["robots"];
}): Metadata {
  const resolvedRobots = robots ?? (noIndex ? { index: false, follow: false } : undefined);

  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    ...(resolvedRobots ? { robots: resolvedRobots } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
      ...(path && { url: path }),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
