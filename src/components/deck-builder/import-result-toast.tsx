"use client";

import { X } from "lucide-react";

interface ImportResultToastProps {
  errors: string[];
  warnings: string[];
  onClose: () => void;
}

export function ImportResultToast({ errors, warnings, onClose }: ImportResultToastProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 max-h-40 overflow-y-auto rounded-lg border border-(--color-border) bg-(--color-surface-1) p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-(--color-foreground)">Import notes</span>
        <button type="button" onClick={onClose} className="text-(--color-foreground-muted)">
          <X className="size-3.5" />
        </button>
      </div>
      <ul className="space-y-1 text-xs text-(--color-foreground-muted)">
        {warnings.map((w) => (
          <li key={w} className="text-(--color-warning)">
            {w}
          </li>
        ))}
        {errors.slice(0, 8).map((e) => (
          <li key={e} className="text-(--color-danger)">
            {e}
          </li>
        ))}
        {errors.length > 8 && (
          <li className="text-(--color-foreground-subtle)">+{errors.length - 8} more</li>
        )}
      </ul>
    </div>
  );
}
