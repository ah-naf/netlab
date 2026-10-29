import { THEME, THEME_SWITCH_LABEL } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

const SUN =
  "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M5.6 18.4L7 17m10-10l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z";
const MOON = "M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z";

/** Shows the theme the click switches to. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const target = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
  const label = THEME_SWITCH_LABEL[target];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggle}
      className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-rule text-ink transition-colors duration-100 hover:border-signal hover:text-signal"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={target === THEME.LIGHT ? SUN : MOON} />
      </svg>
    </button>
  );
}
