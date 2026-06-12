import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export function SecondaryButton({ children, className, size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "border border-(--color-border) bg-(--color-surface-2) text-(--color-foreground) hover:border-(--color-border-strong) hover:bg-(--color-surface-3)",
        "disabled:pointer-events-none disabled:opacity-40",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-9 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
