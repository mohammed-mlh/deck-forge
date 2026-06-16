import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SeoArticle({
  sections,
  className,
}: {
  sections: { heading: string; body: string }[];
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col gap-8", className)}>
      {sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-(--color-foreground)">{section.heading}</h2>
          <p className="text-sm leading-relaxed text-(--color-foreground-muted)">{section.body}</p>
        </section>
      ))}
    </article>
  );
}

export function SeoRelatedLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <aside className="rounded-lg border border-(--color-border) bg-(--color-surface-1)/60 p-5">
      <h2 className="mb-3 text-sm font-semibold text-(--color-foreground)">Related</h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 text-sm text-(--color-primary) hover:underline"
            >
              {link.label}
              <ArrowRight className="size-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function SeoCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-(--color-primary)/30 bg-(--color-primary-muted)/40 p-6">
      <h2 className="text-base font-semibold text-(--color-foreground)">{title}</h2>
      <p className="mt-2 text-sm text-(--color-foreground-muted)">{description}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {primaryLabel}
          <ArrowRight className="size-4" />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center rounded-md border border-(--color-border) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:border-(--color-border-strong) hover:text-(--color-foreground)"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export function SeoContentGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export function SeoContentCard({
  href,
  title,
  description,
  meta,
  imageUrl,
  imageAlt,
  tags,
}: {
  href: string;
  title: string;
  description: string;
  meta?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-(--color-border) bg-(--color-surface-1)/60 p-5 transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)"
    >
      {imageUrl && (
        <div className="mx-auto w-28 overflow-hidden rounded-sm border border-(--color-border) shadow-sm transition-transform group-hover:scale-[1.03]">
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            width={112}
            height={163}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-(--color-foreground) group-hover:text-(--color-primary)">
          {title}
        </h2>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-(--color-surface-2) px-2 py-0.5 text-xs text-(--color-foreground-muted)"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm leading-relaxed text-(--color-foreground-muted)">{description}</p>
        {meta && (
          <span className="mt-auto pt-1 text-xs text-(--color-foreground-subtle)">{meta}</span>
        )}
      </div>
    </Link>
  );
}
