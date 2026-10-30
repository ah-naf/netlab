import { useId, type ReactNode } from "react";
import SectionBoundary from "./SectionBoundary";

export default function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="border-t border-rule">
      <h3 id={headingId} className="px-3 pt-3 pb-1.5 text-sm font-semibold">
        {title}
      </h3>
      <SectionBoundary>{children}</SectionBoundary>
    </section>
  );
}
