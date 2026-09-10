"use client";

import { Button } from "@/components/ui/Button";
import { ScreenSkeleton } from "@/components/onboarding/ScreenSkeleton";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingHydrated } from "@/hooks/use-hydrated";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useLocale } from "@/lib/i18n/context";

export default function CompletePage() {
  const hydrated = useOnboardingHydrated();
  if (!hydrated) return <ScreenSkeleton />;
  return <CompleteSummary />;
}

function CompleteSummary() {
  const { restart } = useOnboarding();
  const { t } = useLocale();
  const c = t.complete;
  const data = useOnboardingStore((state) => state.data);
  const skipped = useOnboardingStore((state) => state.skipped);

  const planName = data.plan ? (t.plan.plans[data.plan]?.name ?? data.plan) : null;
  const interestLabels = data.interests.map(
    (key) => t.preferences.interests[key] ?? key,
  );

  const rows = [
    { label: c.email, value: data.email || c.notSet },
    { label: c.name, value: data.name || c.notSet },
    { label: c.plan, value: planName ?? c.notSet },
    {
      label: c.payment,
      value: skipped.includes("payment")
        ? c.skipped
        : data.paymentAdded
          ? "✓"
          : c.notSet,
    },
    {
      label: c.interests,
      value: skipped.includes("preferences")
        ? c.skipped
        : interestLabels.length > 0
          ? interestLabels.join(", ")
          : c.notSet,
    },
  ];

  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-500/15 text-success-600">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
        {c.title}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
        {c.description}
      </p>

      <div className="mt-6 rounded-card border border-border bg-background p-4 text-left">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {c.summaryTitle}
        </h2>
        <dl className="mt-3 space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className="text-sm font-medium text-foreground text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={restart}>
        {c.cta}
      </Button>

      <button
        type="button"
        onClick={restart}
        className="mt-4 w-full rounded text-center text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {c.startOver}
      </button>
    </div>
  );
}
