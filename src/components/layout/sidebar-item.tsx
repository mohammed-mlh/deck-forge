"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface SidebarItemProps extends NavItem {
  collapsed?: boolean;
}

export function SidebarItem({ label, href, icon: Icon, badge, collapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/deck-builder" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-(--color-primary-muted) font-medium text-(--color-primary)"
          : "font-normal text-(--color-foreground-muted) hover:bg-(--color-surface-2) hover:text-(--color-foreground)",
        collapsed && "justify-center px-2"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive
              ? "text-(--color-primary)"
              : "text-(--color-foreground-subtle) group-hover:text-(--color-foreground-muted)"
          )}
        />
      )}
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto shrink-0 rounded-full bg-(--color-primary-muted) px-1.5 py-0.5 text-xs font-medium text-(--color-primary)">
          {badge}
        </span>
      )}
    </Link>
  );
}
