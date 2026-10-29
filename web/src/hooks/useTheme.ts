import { useSyncExternalStore } from "react";
import { SYSTEM_DARK_QUERY, THEME } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import type { Theme } from "../types/theme";

function subscribeToSystem(onChange: () => void) {
  const query = window.matchMedia(SYSTEM_DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const systemPrefersDark = () => window.matchMedia(SYSTEM_DARK_QUERY).matches;

/** The theme in effect and a way to switch to the other one. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const { choice, setChoice } = useThemeStore();
  const prefersDark = useSyncExternalStore(
    subscribeToSystem,
    systemPrefersDark,
  );
  const systemTheme = prefersDark ? THEME.DARK : THEME.LIGHT;
  const theme = choice ?? systemTheme;
  const toggle = () =>
    setChoice(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
  return { theme, toggle };
}
