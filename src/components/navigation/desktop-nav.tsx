import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface DesktopNavProps {
  items: NavItem[];
  className?: string;
}

export function DesktopNav({ items, className }: DesktopNavProps) {
  return (
    <nav className={cn("hidden items-center gap-0.5 md:flex", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-1.5 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
