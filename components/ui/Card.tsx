import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Surface container for a screen's content. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface p-6 shadow-sm sm:p-8",
        className,
      )}
      {...props}
    />
  );
}
