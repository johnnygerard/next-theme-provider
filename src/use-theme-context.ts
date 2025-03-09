import { useContext } from "react";
import { ThemeContext } from "./theme-context.js";

/**
 * React hook to access the theme context.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === null) throw new Error("Context provider not found");

  return context;
};
