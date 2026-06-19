"use client";

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      storageKey="deck-forge-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const active = resolvedTheme ?? theme ?? "dark";

  return {
    theme: active as "light" | "dark",
    setTheme: (next: "light" | "dark") => setTheme(next),
    toggleTheme: () => setTheme(active === "dark" ? "light" : "dark"),
  };
}
