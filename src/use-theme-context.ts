import { useContext } from "react";
import { ThemeContext } from "./theme-context.js";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === null) throw new Error("Context provider not found");

  return context;
};
