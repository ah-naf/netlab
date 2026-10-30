import type { ReactNode } from "react";
import type { PaletteKind } from "../../types/palette";

const ICONS: Record<PaletteKind, ReactNode> = {
  namespace: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="3 2.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M7 12h3M14 12h3" />
    </>
  ),
  host: (
    <>
      <rect x="4" y="3" width="16" height="10" rx="1.5" />
      <path d="M12 13v2.5M9 15.5h6" />
      <rect x="5" y="18" width="14" height="3" rx="1" />
    </>
  ),
  veth: (
    <>
      <rect x="3" y="8" width="4" height="6" rx="1" />
      <rect x="17" y="8" width="4" height="6" rx="1" />
      <path d="M7 10h2M7 12h2M17 10h-2M17 12h-2" />
      <path d="M5 14v1.5Q5 20 12 20t7-4.5V14" />
    </>
  ),
  bridge: (
    <>
      <rect x="2" y="5" width="20" height="4" rx="1" />
      <path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8" />
    </>
  ),
  router: (
    <>
      <rect x="8" y="8" width="8" height="8" rx="1.5" />
      <path d="M12 8V3M10 5l2-2 2 2M12 16v5M10 19l2 2 2-2M8 12H3M5 10l-2 2 2 2M16 12h5M19 10l2 2-2 2" />
    </>
  ),
  nat: (
    <>
      <rect x="2" y="8" width="6" height="8" rx="1" />
      <rect x="16" y="8" width="6" height="8" rx="1" />
      <path d="M12 3v18" strokeDasharray="2 2" />
      <path d="M9 10h6M13 8l2 2-2 2M15 14H9M11 12l-2 2 2 2" />
    </>
  ),
};

interface Props {
  kind: PaletteKind;
  size?: number;
}

export default function NodeIcon({ kind, size = 16 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[kind]}
    </svg>
  );
}
