import { create } from "zustand";

interface FieldErrorState {
  errors: Set<string>;
  setError: (key: string, on: boolean) => void;
}

/** Fields with an unresolved error; not part of lab history. */
export const useFieldErrorStore = create<FieldErrorState>()((set) => ({
  errors: new Set(),
  setError: (key, on) =>
    set((state) => {
      if (state.errors.has(key) === on) return state;
      const errors = new Set(state.errors);
      if (on) errors.add(key);
      else errors.delete(key);
      return { errors };
    }),
}));

export const hasFieldErrors = (state: FieldErrorState) => state.errors.size > 0;
