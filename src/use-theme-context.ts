import { useContext } from "react";
import { ThemeContext } from "./theme-context.js";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context) return context;
  throw new Error("Context provider not found");
};
