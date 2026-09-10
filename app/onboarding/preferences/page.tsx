"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ScreenSkeleton } from "@/components/onboarding/ScreenSkeleton";
import { StepHeading } from "@/components/onboarding/StepHeading";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingHydrated } from "@/hooks/use-hydrated";
import { useOnboardingStore } from "@/store/onboarding-store";
import { isApiError } from "@/lib/api/client";
import { api } from "@/lib/api/endpoints";
import { useLocale } from "@/lib/i18n/context";
import { translateFieldError } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

const INTEREST_KEYS = [
  "design",
  "development",
  "marketing",
  "business",
  "photography",
  "music",
  "writing",
  "fitness",
] as const;

export default function PreferencesPage() {
  const hydrated = useOnboardingHydrated();
  if (!hydrated) return <ScreenSkeleton />;
  return <PreferencesForm />;
}

function PreferencesForm() {
  const { next, skip } = useOnboarding();
  const { t } = useLocale();
  const p = t.preferences;
  const updateData = useOnboardingStore((state) => state.updateData);
  const savedInterests = useOnboardingStore((state) => state.data.interests);
  const savedNotifications = useOnboardingStore((state) => state.data.notifications);

  const [selected, setSelected] = useState<Set<string>>(new Set(savedInterests));
  const [notifications, setNotifications] = useState(savedNotifications);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleInterest = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const interests = Array.from(selected);
      await api.savePreferences({ interests, notifications });
      updateData({ interests, notifications });
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

      <div className="mt-6 space-y-6">
        <fieldset>
          <legend className="text-sm font-medium text-foreground">
            {p.interestsLabel}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTEREST_KEYS.map((key) => {
              const isSelected = selected.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleInterest(key)}
                  aria-pressed={isSelected}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-border bg-surface text-muted hover:border-brand-500/50 hover:text-foreground",
                  )}
                >
                  {p.interests[key] ?? key}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 rounded-field bg-background p-3">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-600"
          />
          <span>
            <span className="block text-sm font-medium text-foreground">
              {p.notificationsLabel}
            </span>
            <span className="block text-xs text-muted">
              {p.notificationsHint}
            </span>
          </span>
        </label>
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        loading={submitting}
        onClick={onSubmit}
      >
        {submitting ? p.submitting : p.submit}
      </Button>

      <button
        type="button"
        onClick={skip}
        className="mt-4 w-full rounded text-center text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {p.skipForNow}
      </button>
    </div>
  );
}
