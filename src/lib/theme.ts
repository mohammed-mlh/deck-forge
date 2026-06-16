export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "deck-forge-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return null;
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

type ThemeListener = () => void;

const themeListeners = new Set<ThemeListener>();

export function subscribeToTheme(listener: ThemeListener) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

export function writeTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  applyTheme(theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  notifyThemeListeners();
}

export function getServerTheme(): Theme {
  return "dark";
}
