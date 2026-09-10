"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/onboarding/OtpInput";
import { ScreenSkeleton } from "@/components/onboarding/ScreenSkeleton";
import { StepHeading } from "@/components/onboarding/StepHeading";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingHydrated } from "@/hooks/use-hydrated";
import { useOnboardingStore } from "@/store/onboarding-store";
import { isApiError } from "@/lib/api/client";
import { api } from "@/lib/api/endpoints";
import { useLocale } from "@/lib/i18n/context";
import { translateFieldError, verifySchema, type VerifyFormValues } from "@/lib/validation/schemas";

const RESEND_COOLDOWN_SECONDS = 30;

/** Step 3 — Verify email. Handles loading / error / success and a resend cooldown. */
export default function VerifyPage() {
  const hydrated = useOnboardingHydrated();
  const email = useOnboardingStore((state) => state.data.email);
  const verified = useOnboardingStore((state) => state.data.verified);

  if (!hydrated) return <ScreenSkeleton />;
  return <VerifyForm email={email} alreadyVerified={verified} />;
}

function VerifyForm({
  email,
  alreadyVerified,
}: {
  email: string;
  alreadyVerified: boolean;
}) {
  const { goTo, next } = useOnboarding();
  const { t } = useLocale();
  const v = t.verify;
  const updateData = useOnboardingStore((state) => state.updateData);

  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Guard: reached /verify without an account.
  if (!email) {
    return (
      <div>
        <StepHeading
          title={v.noAccountTitle}
          description={v.noAccountDescription}
        />
        <Alert variant="info" className="mt-5">
          {v.noAccountAlert}
        </Alert>
        <Button className="mt-6" fullWidth onClick={() => goTo("signup")}>
          {v.noAccountCta}
        </Button>
      </div>
    );
  }

  // Success state — email verified, continue to profile.
  if (alreadyVerified) {
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
          {v.successTitle}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
          {v.successDescription(email)}
        </p>
        <Button className="mt-6" size="lg" fullWidth onClick={next}>
          {v.successCta}
        </Button>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setNotice(null);
    try {
      await api.verifyOtp({ email, code: values.code });
      updateData({ verified: true });
    } catch (err) {
      if (isApiError(err)) {
        const fieldErrors = err.fieldErrors;
        if (fieldErrors?.code) setError("code", { message: fieldErrors.code });
        setFormError(translateFieldError(err.message, t) ?? v.genericError);
      } else {
        setFormError(v.genericError);
      }
    }
  });

  const resendCode = () => {
    setNotice(v.resendSuccess);
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <div>
      <StepHeading
        title={v.title}
        description={v.description(email)}
      />

      {formError && (
        <Alert className="mt-5" onDismiss={() => setFormError(null)}>
          {formError}
        </Alert>
      )}
      {notice && (
        <Alert variant="success" className="mt-5" onDismiss={() => setNotice(null)}>
          {notice}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              error={translateFieldError(errors.code?.message, t)}
              disabled={isSubmitting}
              onComplete={(code) => {
                setValue("code", code, { shouldValidate: true });
                void onSubmit();
              }}
            />
          )}
        />

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? v.submitting : v.submit}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="text-muted">{v.resendPrompt}</span>
        <button
          type="button"
          onClick={resendCode}
          disabled={secondsLeft > 0 || isSubmitting}
          className="rounded font-medium text-brand-600 transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {secondsLeft > 0 ? v.resendIn(secondsLeft) : v.resend}
        </button>
      </div>

      <p className="mt-4 rounded-field bg-brand-50 px-3 py-2 text-center text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
        {v.codeHint}
      </p>
    </div>
  );
}
