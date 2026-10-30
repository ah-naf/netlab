import NotAvailable from "./NotAvailable";

interface Props {
  as: "aside" | "main";
  label: string;
  hint: string;
  className?: string;
}

export default function SidePanel({
  as: Tag,
  label,
  hint,
  className = "",
}: Props) {
  return (
    <Tag
      aria-label={label}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden border border-rule bg-panel ${className}`}
    >
      <div className="flex h-6 shrink-0 items-center border-b border-rule px-3 text-xs font-medium text-ink-muted">
        {label}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <NotAvailable name={label} hint={hint} />
      </div>
    </Tag>
  );
}
