import Link from "next/link";

export function DeckNotFound() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-lg font-semibold text-(--color-foreground)">Deck not found</h2>
      <p className="max-w-sm text-sm text-(--color-foreground-muted)">
        This deck may have been deleted or the link is invalid.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/deck-builder"
          className="rounded-md bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:bg-(--color-primary-hover)"
        >
          New deck
        </Link>
        <Link
          href="/my-decks"
          className="rounded-md border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-sm text-(--color-foreground-muted) transition-colors hover:bg-(--color-surface-3)"
        >
          My Decks
        </Link>
      </div>
    </div>
  );
}
