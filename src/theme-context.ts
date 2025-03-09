"use client";
import { createContext } from "react";
import type { Theme } from "./type/theme.js";

export const ThemeContext = createContext<
  | {
      theme: Theme;
      setTheme: (theme: Theme) => void;
      toggleTheme: () => void;
    }
  | undefined
>(undefined);
