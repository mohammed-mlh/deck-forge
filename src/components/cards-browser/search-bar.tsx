"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar(
    { value, onChange, placeholder = "Search cards by name…", className },
    ref
  ) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-(--color-border) bg-(--color-surface-1) px-3 py-2 transition-colors focus-within:border-(--color-border-focus)",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-(--color-foreground-subtle)" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-(--color-foreground) outline-none placeholder:text-(--color-foreground-disabled)"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-sm p-1 text-(--color-foreground-subtle) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-foreground)"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
  }
);
