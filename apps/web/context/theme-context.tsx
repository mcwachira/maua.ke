"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  ResolvedTheme,
  ThemeMode,
} from "@/types/shop";

import {
  loadTheme,
  saveTheme,
} from "@/lib/storage";

interface ThemeContextValue {
  theme: ThemeMode;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

function resolveTheme(
  mode: ThemeMode,
): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  if (mode === "light" || mode === "dark") {
    return mode;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

function applyTheme(
  mode: ThemeMode,
): ResolvedTheme {
  const resolved = resolveTheme(mode);

  document.documentElement.classList.toggle(
    "dark",
    resolved === "dark",
  );

  return resolved;
}

export function ThemeProvider({
                                children,
                              }: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemeMode>(() => loadTheme());

  const [resolved, setResolved] =
    useState<ResolvedTheme>(() =>
      typeof window === "undefined"
        ? "light"
        : resolveTheme(loadTheme()),
    );

  /*
   * Synchronise the external DOM with the current
   * theme. This effect only writes to the document,
   * it never derives React state.
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = () => {
      setResolved(applyTheme("system"));
    };

    mediaQuery.addEventListener(
      "change",
      handleChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange,
      );
    };
  }, [theme]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      saveTheme(mode);
      setResolved(applyTheme(mode));
    },
    [],
  );

  const value = useMemo(
    () => ({
      theme,
      resolved,
      setTheme,
    }),
    [theme, resolved, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };