import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";
import { getCardArtUrl } from "@/lib/deck-preview";
import type { Card } from "@/features/cards/cards.schema";

interface DeckPreviewCardProps {
  href: string;
  featured: Card | null;
  badge: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function DeckPreviewCard({
  href,
  featured,
  badge,
  children,
  actions,
}: DeckPreviewCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-[168px] overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong) hover:bg-(--color-surface-2)"
    >
      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-4 pr-2">
        {children}
      </div>

      <div className="relative h-full w-[44%] shrink-0 sm:w-[40%]">
        {featured ? (
          <>
            <Image
              src={getCardArtUrl(featured)}
              alt={featured.name}
              fill
              sizes="(max-width: 640px) 44vw, 280px"
              className="object-cover object-[center_20%]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-(--color-surface-1) via-(--color-surface-1)/70 to-transparent transition-colors group-hover:from-(--color-surface-2) group-hover:via-(--color-surface-2)/70" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-(--color-bg-elevated)">
            <Layers className="size-8 text-(--color-foreground-disabled)" />
          </div>
        )}

        {badge}
      </div>

      {actions}
    </Link>
  );
}
