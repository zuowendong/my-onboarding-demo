"use client";

import {
  useId,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
  /** Fired once every digit is filled — used to auto-submit. */
  onComplete?: (value: string) => void;
};

/**
 * Accessible 6-digit one-time-code input.
 * Auto-advances on entry, supports paste, Backspace-to-previous, and arrow keys.
 * Controlled: `value` is the single source of truth.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  error,
  disabled,
  onComplete,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const errorId = useId();
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const commit = (nextDigits: string[], focusIndex: number) => {
    const joined = nextDigits.join("").slice(0, length);
    onChange(joined);
    inputsRef.current[Math.min(focusIndex, length - 1)]?.focus();
    if (joined.length === length) onComplete?.(joined);
  };

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, "");
    const next = digits.slice();
    if (!raw) {
      next[index] = "";
      onChange(next.join(""));
      return;
    }
    for (let i = 0; i < raw.length && index + i < length; i++) {
      next[index + i] = raw[i];
    }
    commit(next, index + raw.length);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = digits.slice();
      if (next[index]) {
        next[index] = "";
        onChange(next.join(""));
      } else if (index > 0) {
        next[index - 1] = "";
        onChange(next.join(""));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const next = digits.slice();
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      next[index + i] = pasted[i];
    }
    commit(next, index + pasted.length);
  };

  return (
    <div>
      <div
        className="flex gap-2"
        role="group"
        aria-label="Verification code"
        aria-describedby={error ? errorId : undefined}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onPaste={handlePaste(i)}
            onFocus={(event) => event.target.select()}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "h-12 w-full min-w-0 flex-1 rounded-field border bg-surface text-center text-lg font-semibold tabular-nums text-foreground",
              "transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error ? "border-danger-500" : "border-border",
            )}
          />
        ))}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-xs font-medium text-danger-600 dark:text-danger-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}
