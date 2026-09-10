"use client";

import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** Total number of steps in the flow. */
  total: number;
  /** 0-based index of the active step. */
  current: number;
  className?: string;
};

/** Segmented progress indicator, exposed to assistive tech as a progressbar. */
export function ProgressBar({ total, current, className }: ProgressBarProps) {
  const { t } = useLocale();

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(current + 1, total)}
      aria-label={t.common.stepOf(current + 1, total)}
    >
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i <= current ? "bg-brand-600" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
