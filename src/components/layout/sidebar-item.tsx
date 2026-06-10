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
  const isActive = pathname === href || (href !== "/app" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-[var(--color-primary-muted)] font-medium text-[var(--color-primary)]"
          : "font-normal text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]",
        collapsed && "justify-center px-2"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-foreground-subtle)] group-hover:text-[var(--color-foreground-muted)]"
          )}
        />
      )}
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && badge && (
        <span className="ml-auto shrink-0 rounded-full bg-[var(--color-primary-muted)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
          {badge}
        </span>
      )}
    </Link>
  );
}
