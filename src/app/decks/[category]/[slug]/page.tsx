import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicDeckDetail } from "@/app/decks/detail/content";
import { toSavedDeck } from "@/features/decks/decks.service";
import { getPublicDeckBySlug } from "@/features/public-decks/public-decks.service";
import { categorySlug } from "@/features/public-decks/public-decks.view";
import { buildDeckMetadata } from "@/lib/decks/deck-metadata";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const record = await getPublicDeckBySlug(slug);
  if (!record) return { title: "Deck not found" };
  return buildDeckMetadata(await toSavedDeck(record), `${category}/${record.slug}`);
}

export default async function PublicDeckPage({ params }: Props) {
  const { slug } = await params;
  const record = await getPublicDeckBySlug(slug);
  if (!record) notFound();

  const deck = await toSavedDeck(record);
  const backHref = `/decks/${categorySlug(record.metadata?.category ?? "")}`;

  return (
    <PublicDeckDetail deck={deck} metadata={record.metadata} backHref={backHref} />
  );
}
