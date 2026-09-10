"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ScreenSkeleton } from "@/components/onboarding/ScreenSkeleton";
import { StepHeading } from "@/components/onboarding/StepHeading";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingHydrated } from "@/hooks/use-hydrated";
import { useOnboardingStore } from "@/store/onboarding-store";
import { isApiError } from "@/lib/api/client";
import { api } from "@/lib/api/endpoints";
import type { Plan } from "@/lib/api/types";
import { useLocale } from "@/lib/i18n/context";
import { translateFieldError } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";
import type { PlanId } from "@/types/onboarding";

export default function PlanPage() {
  const hydrated = useOnboardingHydrated();
  if (!hydrated) return <ScreenSkeleton />;
  return <PlanSelection />;
}

function PlanSelection() {
  const { next } = useOnboarding();
  const { t } = useLocale();
  const p = t.plan;
  const updateData = useOnboardingStore((state) => state.updateData);
  const currentPlan = useOnboardingStore((state) => state.data.plan);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<PlanId | null>(currentPlan);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getPlans().then((data) => {
      if (!cancelled) {
        setPlans(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const onSelect = async () => {
    if (!selected) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await api.selectPlan({ planId: selected });
      updateData({ plan: selected });
      next();
    } catch (err) {
      if (isApiError(err)) {
        setFormError(translateFieldError(err.message, t) ?? p.genericError);
      } else {
        setFormError(p.genericError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ScreenSkeleton />;

  return (
    <div>
      <StepHeading title={p.title} description={p.description} />

      {formError && (
        <Alert
          className="mt-5"
          title={p.errorTitle}
          onDismiss={() => setFormError(null)}
        >
          {formError}
        </Alert>
      )}

      <div className="mt-6 space-y-3">
        {plans.map((plan) => {
          const info = p.plans[plan.id];
          if (!info) return null;
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id as PlanId)}
              aria-pressed={isSelected}
              className={cn(
                "w-full rounded-card border p-4 text-left transition-colors",
                isSelected
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10"
                  : "border-border bg-surface hover:border-brand-500/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {info.name}
                </span>
                <span className="text-sm font-medium text-brand-600">
                  ${plan.price}{p.perMonth}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{info.description}</p>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {info.features.map((feature) => (
                  <li key={feature} className="text-xs text-muted">
                    • {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        disabled={!selected}
        loading={submitting}
        onClick={onSelect}
      >
        {submitting ? p.submitting : p.submit}
      </Button>
    </div>
  );
}
