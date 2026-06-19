import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PublicDecksBrowser } from "@/components/decks/public-decks-browser";
import { getPublicDecks } from "@/features/public-decks/public-decks.service";
import { categorySlug, toListItem } from "@/features/public-decks/public-decks.view";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ category: string }> };

async function loadCategory(slug: string) {
  const decks = await getPublicDecks();
  const items = decks.map(toListItem);
  const inCategory = items.filter((item) => categorySlug(item.category) === slug);
  if (inCategory.length === 0) return null;
  return { name: inCategory[0].category, items: inCategory };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await loadCategory(slug);
  if (!category) return { title: "Category not found" };
  return createPageMetadata({
    title: `${category.name} Decks`,
    description: `Browse ${category.name} Yu-Gi-Oh decks.`,
    path: `/decks/${slug}`,
  });
}

export default async function DeckCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await loadCategory(slug);
  if (!category) notFound();

  return (
    <Container className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/decks"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
        >
          <ArrowLeft className="size-4" />
          All categories
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-(--color-foreground)">{category.name}</h2>
          <p className="text-sm text-(--color-foreground-muted)">
            {category.items.length} {category.items.length === 1 ? "deck" : "decks"}
          </p>
        </div>
      </div>

      <PublicDecksBrowser decks={category.items} showCategories={false} />
    </Container>
  );
}
