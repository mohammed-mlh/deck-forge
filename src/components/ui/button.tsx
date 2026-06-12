import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-(--color-primary) text-(--color-primary-foreground) hover:bg-(--color-primary-hover) active:bg-(--color-primary-active)",
  secondary:
    "border border-(--color-border) bg-(--color-surface-2) text-(--color-foreground) hover:border-(--color-border-strong) hover:bg-(--color-surface-3)",
  ghost:
    "text-(--color-foreground-muted) hover:bg-(--color-surface-2) hover:text-(--color-foreground)",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
