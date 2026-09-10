"use client";

import { Button } from "@/components/ui/Button";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLocale } from "@/lib/i18n/context";

/** Step 1 — Welcome. Sets the visual tone for the flow. */
export default function WelcomePage() {
  const { next } = useOnboarding();
  const { t } = useLocale();
  const w = t.welcome;

  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
          <path d="M12 2.5 14.2 9l6.8.6-5.2 4.4 1.6 6.6L12 17l-5.4 3.6 1.6-6.6L3 9.6 9.8 9 12 2.5Z" />
        </svg>
      </div>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        {w.heading}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
        {w.description}
      </p>

      <ul className="mt-6 space-y-2.5 text-left">
        {w.highlights.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-field bg-background p-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-medium text-foreground">
                {item.title}
              </span>
              <span className="block text-xs text-muted">{item.body}</span>
            </span>
          </li>
        ))}
      </ul>

      <Button size="lg" fullWidth className="mt-6" onClick={next}>
        {w.cta}
      </Button>

      <p className="mt-4 text-xs text-muted">
        {w.signInPrompt}{" "}
        <span className="cursor-pointer font-medium text-brand-600 underline underline-offset-2">
          {w.signIn}
        </span>
      </p>
    </div>
  );
}
