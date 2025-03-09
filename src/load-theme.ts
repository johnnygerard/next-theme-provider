import { cookies } from "next/headers.js";
import { THEME_KEY } from "./constants.js";
import { type Theme, THEME } from "./type/theme.js";

/**
 * Server function to load user theme preference from a cookie.
 * @returns User theme preference
 * @see {@link https://nextjs.org/docs/app/api-reference/directives/use-server|use-server}
 */
export const loadTheme = async (): Promise<Theme> => {
  "use server";
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_KEY)?.value;

  return theme === THEME.DARK || theme === THEME.LIGHT ? theme : THEME.SYSTEM;
};
