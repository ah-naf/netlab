import type { THEME } from "../constants/theme";

export type Theme = (typeof THEME)[keyof typeof THEME];
