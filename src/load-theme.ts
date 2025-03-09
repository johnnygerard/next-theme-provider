import { cookies } from "next/headers.js";
import { THEME_KEY } from "./constants.js";
import { type Theme, THEME } from "./type/theme.js";

/**
 * Retrieve user theme preference from cookies.
 * @returns User theme preference
 */
export const loadTheme = async (): Promise<Theme> => {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_KEY)?.value;

  return theme === THEME.DARK || theme === THEME.LIGHT ? theme : THEME.SYSTEM;
};
