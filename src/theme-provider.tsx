"use client";
import { memo, type ReactNode, useEffect, useRef, useState } from "react";
import { THEME_KEY } from "./constants.js";
import { ThemeContext } from "./theme-context.js";
import { type Theme, THEME } from "./type/theme.js";

type Props = {
  children: ReactNode;
  initialTheme: Theme;
};

/**
 * React context provider to manage the theme state.
 */
export const ThemeProvider = memo(({ children, initialTheme }: Props) => {
  const [theme, setTheme] = useState(initialTheme);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const PREFERS_DARK = "(prefers-color-scheme: dark)";

  const [isDark, setIsDark] = useState(
    theme === THEME.SYSTEM ? null : theme === THEME.DARK,
  );

  // Listen for theme change from other tabs
  useEffect(() => {
    if (window.BroadcastChannel === undefined) {
      console.warn(
        "Unsupported BroadcastChannel:",
        "Unable to synchronize theme across tabs.",
      );

      return;
    }

    const channel = new BroadcastChannel(THEME_KEY);
    channelRef.current = channel;

    channel.onmessage = ({ data }: MessageEvent<Theme>) => {
      setTheme(data);
    };

    return () => {
      channel.close();
    };
  }, []);

  // Synchronize theme with CSS
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Initialize system theme
  useEffect(() => {
    if (isDark === null) setIsDark(window.matchMedia(PREFERS_DARK).matches);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const systemQuery = window.matchMedia(PREFERS_DARK);

    const listener = (event: MediaQueryListEvent) => {
      if (theme === THEME.SYSTEM) setIsDark(event.matches);
    };

    systemQuery.addEventListener("change", listener);

    return () => {
      systemQuery.removeEventListener("change", listener);
    };
  }, []);

  const handleThemeChange = (theme: Theme): void => {
    setTheme(theme);
    setIsDark(
      theme === THEME.SYSTEM
        ? window.matchMedia(PREFERS_DARK).matches
        : theme === THEME.DARK,
    );

    // Persist theme with a cookie
    document.cookie = [
      `${THEME_KEY}=${theme}`,
      `max-age=${365 * 24 * 60 * 60}`, // 1 year
      "secure",
      "path=/",
      "samesite=lax",
    ].join("; ");

    // Broadcast theme change to other tabs
    channelRef.current?.postMessage(theme);
  };

  const toggleTheme = (): void => {
    const isDark =
      (theme === THEME.SYSTEM && window.matchMedia(PREFERS_DARK).matches) ||
      theme === THEME.DARK;

    handleThemeChange(isDark ? THEME.LIGHT : THEME.DARK);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleThemeChange,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = "ThemeProvider";
