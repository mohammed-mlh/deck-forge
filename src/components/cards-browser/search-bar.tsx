"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search cards by name…",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 transition-colors focus-within:border-[var(--color-border-focus)]",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-[var(--color-foreground-subtle)]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-foreground-disabled)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-[var(--radius-sm)] p-1 text-[var(--color-foreground-subtle)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
