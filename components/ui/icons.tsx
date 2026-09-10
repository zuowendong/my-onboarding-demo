import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

/**
 * Lumen brand mark — a rounded square with a star.
 * NOTE: `app/icon.svg` (the favicon) mirrors this exact geometry. Keep the two
 * in sync if the logo ever changes.
 */
export function BrandMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="24" height="24" rx="7" className="fill-brand-600" />
      <path
        d="M12 6.5 13.6 10l3.9.4-2.9 2.6.9 3.8L12 14.8 8.5 16.8l.9-3.8L6.5 10.4 10.4 10 12 6.5Z"
        className="fill-white"
      />
    </svg>
  );
}

/** Chevron pointing left — used by the shell's Back control. */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
