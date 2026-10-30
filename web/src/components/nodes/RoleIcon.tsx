import type { ReactNode } from "react";
import type { Role } from "../../types/topology";

const ICON_PATHS: Record<Role, ReactNode> = {
  host: (
    <>
      <rect x="2" y="3" width="12" height="8" rx="1" />
      <path d="M6 14h4M8 11v3" />
    </>
  ),
  router: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M5 8h6M9 6l2 2-2 2M7 6L5 8l2 2" />
    </>
  ),
  nat: (
    <>
      <path d="M3 5h10M10 2l3 3-3 3M13 11H3M6 8l-3 3 3 3" />
    </>
  ),
};

const DEFAULT_ROLE: Role = "host";

export default function RoleIcon({ role = DEFAULT_ROLE }: { role?: Role }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[role]}
    </svg>
  );
}
