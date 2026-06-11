"use client";

import Link from "next/link";
import {
  Layers,
  Hammer,
  FolderOpen,
} from "lucide-react";
import { SidebarItem } from "@/components/layout/sidebar-item";
import type { NavItem } from "@/types";

const sidebarItems: NavItem[] = [
  { label: "Builder",  href: "/deck-builder", icon: Hammer     },
  { label: "My Decks", href: "/decks",        icon: FolderOpen },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[var(--color-border)] px-4">
        <Link href="/deck-builder" className="flex items-center gap-2.5 font-semibold text-[var(--color-foreground)]">
          <Layers className="size-5 text-[var(--color-primary)]" />
          <span className="text-sm">DeckForge</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--color-border)] p-2">
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-2)]">
          <div className="size-7 shrink-0 rounded-full bg-[var(--color-surface-3)]" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-[var(--color-foreground)]">User Name</span>
            <span className="truncate text-xs text-[var(--color-foreground-subtle)]">user@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
