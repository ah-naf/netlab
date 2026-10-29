import { NOT_AVAILABLE_TEXT } from "../constants/layout";

interface Props {
  name: string;
  hint?: string;
}

export default function NotAvailable({ name, hint }: Props) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <h2 className="text-[15px] font-semibold text-ink">{name}</h2>
      <p className="text-ink-muted">{NOT_AVAILABLE_TEXT}</p>
      {hint && <p className="text-ink-muted">{hint}</p>}
    </div>
  );
}
