import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ImageLinkCard({
  href,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  className,
  sizes = "(max-width: 640px) 100vw, 360px",
}: {
  href: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-1) transition-colors hover:border-(--color-border-strong)",
        className
      )}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover object-[center_25%] transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
      <div className="relative flex flex-col gap-1 p-4">
        <h3 className="font-semibold text-white drop-shadow">{title}</h3>
        {subtitle && <p className="line-clamp-2 text-xs text-white/70">{subtitle}</p>}
      </div>
    </Link>
  );
}
