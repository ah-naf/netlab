export const THEME = { LIGHT: "light", DARK: "dark" } as const;

export const THEME_STORAGE_KEY = "netlab.theme";
export const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/** Keyed by the theme the button switches to. */
export const THEME_SWITCH_LABEL = {
  [THEME.LIGHT]: "Switch to light theme",
  [THEME.DARK]: "Switch to dark theme",
} as const;
