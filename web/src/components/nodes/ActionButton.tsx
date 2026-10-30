import type { ButtonHTMLAttributes } from "react";

export default function ActionButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`nodrag cursor-pointer text-xs text-ink-muted hover:text-signal ${className}`}
      {...props}
    />
  );
}
