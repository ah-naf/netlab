import { create } from "zustand";

interface ValidationState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useValidationStore = create<ValidationState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
