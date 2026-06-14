import type { Metadata } from "next";

const SITE_NAME = "DeckForge";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    ...(noIndex && { robots: { index: false, follow: false } }),
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
