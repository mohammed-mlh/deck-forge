import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PublicDecksBrowser } from "@/components/decks/public-decks-browser";
import {
  getPublicDeckCategories,
  getPublicDecksPage,
} from "@/features/public-decks/public-decks.service";
import { categorySlug, parseSort, toListItem } from "@/features/public-decks/public-decks.view";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
};

async function resolveCategory(slug: string): Promise<string | null> {
  const categories = await getPublicDeckCategories();
  return categories.find((cat) => categorySlug(cat.category) === slug)?.category ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const label = await resolveCategory(slug);
  if (!label) return { title: "Category not found" };
  return createPageMetadata({
    title: `${label} Decks`,
    description: `Browse ${label} Yu-Gi-Oh decks.`,
    path: `/app/decks/${slug}`,
  });
}

export default async function DeckCategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const { q, sort, page } = await searchParams;

  const label = await resolveCategory(slug);
  if (!label) notFound();

  const result = await getPublicDecksPage({
    query: q,
    sort: parseSort(sort),
    category: label,
    page: Number(page) || 1,
  });

  const items = result.items.map(toListItem);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Link
            href="/app/decks"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground)"
          >
            <ArrowLeft className="size-4" />
            All categories
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-(--color-foreground)">{label}</h2>
            <p className="text-sm text-(--color-foreground-muted)">
              {result.total} {result.total === 1 ? "deck" : "decks"}
            </p>
          </div>
        </div>

        <PublicDecksBrowser
          decks={items}
          total={result.total}
          page={result.page}
          pageCount={result.pageCount}
          query={q ?? ""}
          sort={parseSort(sort)}
          category={label}
          basePath={`/app/decks/${slug}`}
          showCategories={false}
        />
      </Container>
    </div>
  );
}
