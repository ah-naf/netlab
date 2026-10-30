import { useEffect } from "react";
import { LINK_NOTICE_MS } from "../constants/links";

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function LinkNotice({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, LINK_NOTICE_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;
  return (
    <div
      role="alert"
      className="absolute top-2 left-1/2 z-10 -translate-x-1/2 border border-led-fault bg-panel px-3 py-1 text-xs text-ink"
    >
      {message}
    </div>
  );
}
