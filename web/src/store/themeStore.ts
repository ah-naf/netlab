import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { THEME, THEME_STORAGE_KEY } from "../constants/theme";
import type { Theme } from "../types/theme";
import { safeStorage } from "./safeStorage";

interface ThemeState {
  /** null follows the system setting. */
  choice: Theme | null;
  setChoice: (choice: Theme) => void;
}

const isTheme = (value: unknown): value is Theme =>
  Object.values(THEME).includes(value as Theme);

export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ choice: null, setChoice: (choice) => set({ choice }) }), {
    name: THEME_STORAGE_KEY,
    storage: createJSONStorage(() => safeStorage),
    partialize: ({ choice }) => ({ choice }),
    merge: (stored, current) => {
      const { choice } = { ...(stored as Partial<ThemeState>) };
      return { ...current, choice: isTheme(choice) ? choice : null };
    },
  }),
);

/** Runs at import, before the first render, so the page never flashes the wrong theme. */
function applyChoice({ choice }: Pick<ThemeState, "choice">) {
  const root = document.documentElement.dataset;
  if (choice) root.theme = choice;
  else delete root.theme;
}
applyChoice(useThemeStore.getState());
useThemeStore.subscribe(applyChoice);
