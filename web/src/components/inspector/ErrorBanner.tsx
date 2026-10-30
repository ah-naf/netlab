import { errorBannerText } from "../../constants/inspector";
import { useFieldErrorStore } from "../../store/fieldErrorStore";

export default function ErrorBanner() {
  const count = useFieldErrorStore((s) => s.errors.size);
  if (!count) return null;
  return (
    <p
      role="status"
      className="border-b border-led-fault px-3 py-1 text-xs text-led-fault"
    >
      {errorBannerText(count)}
    </p>
  );
}
