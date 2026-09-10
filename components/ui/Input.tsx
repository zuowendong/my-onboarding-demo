import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

/**
 * Labeled text input wired for accessibility and react-hook-form.
 * Spread `register("field")` onto it — the ref forwards to the native input.
 */
export function Input({
  label,
  error,
  hint,
  id,
  className,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const describedById =
    [error ? errorId : null, hint && !error ? hintId : null, describedBy]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedById}
        className={cn(
          "h-11 w-full rounded-field border bg-surface px-3.5 text-sm text-foreground",
          "placeholder:text-muted/70 transition-colors",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40",
          error ? "border-danger-500" : "border-border",
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-danger-600 dark:text-danger-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
