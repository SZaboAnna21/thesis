import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "fotoc.theme";
const listeners = new Set<() => void>();

function load(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let theme = load();
document.documentElement.classList.toggle("dark", theme === "dark");

export function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
  }
  listeners.forEach((notify) => notify());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => theme);
}
