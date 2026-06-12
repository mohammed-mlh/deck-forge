export const clerkAppearance = {
  variables: {
    colorPrimary: "#7C3AED",
    colorBackground: "#18181B",
    colorInputBackground: "#27272A",
    colorInputText: "#FAFAFA",
    colorText: "#FAFAFA",
    colorTextSecondary: "#A1A1AA",
    colorDanger: "#EF4444",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-geist-sans), Inter, ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    card: "shadow-none border-0 bg-transparent p-0",
    headerTitle: "text-(--color-foreground)",
    headerSubtitle: "text-(--color-foreground-muted)",
    socialButtonsBlockButton:
      "border border-(--color-border) bg-(--color-surface-2) text-(--color-foreground) hover:bg-(--color-surface-3)",
    formButtonPrimary:
      "bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-primary-foreground)",
    formFieldInput:
      "border-(--color-border) bg-(--color-surface-2) text-(--color-foreground)",
    footerActionLink: "text-(--color-primary) hover:text-(--color-primary-hover)",
  },
};
