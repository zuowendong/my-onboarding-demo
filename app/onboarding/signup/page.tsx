"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenSkeleton } from "@/components/onboarding/ScreenSkeleton";
import { StepHeading } from "@/components/onboarding/StepHeading";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useOnboardingHydrated } from "@/hooks/use-hydrated";
import { useOnboardingStore } from "@/store/onboarding-store";
import { isApiError } from "@/lib/api/client";
import { api } from "@/lib/api/endpoints";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  getPasswordChecks,
  signupSchema,
  translateFieldError,
  type SignupFormValues,
} from "@/lib/validation/schemas";

/** Step 2 — Sign up. Gates on hydration so a persisted email pre-fills safely. */
export default function SignupPage() {
  const hydrated = useOnboardingHydrated();
  const email = useOnboardingStore((state) => state.data.email);

  if (!hydrated) return <ScreenSkeleton />;
  return <SignupForm defaultEmail={email} />;
}

function SignupForm({ defaultEmail }: { defaultEmail: string }) {
  const { next } = useOnboarding();
  const { t } = useLocale();
  const s = t.signup;
  const updateData = useOnboardingStore((state) => state.updateData);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: defaultEmail, password: "" },
    mode: "onBlur",
  });

  const password = useWatch({ control, name: "password" });
  const checks = getPasswordChecks(password ?? "", s.passwordChecks);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.signup(values);
      updateData({ email: values.email.trim().toLowerCase() });
      next();
    } catch (err) {
      if (isApiError(err)) {
        const fieldErrors = err.fieldErrors;
        if (fieldErrors) {
          (Object.keys(fieldErrors) as Array<keyof SignupFormValues>).forEach(
            (field) => setError(field, { message: fieldErrors[field] }),
          );
        }
        setFormError(translateFieldError(err.message, t) ?? s.genericError);
      } else {
        setFormError(s.genericError);
      }
    }
  });

  return (
    <div>
      <StepHeading
        title={s.title}
        description={s.description}
      />

      {formError && (
        <Alert
          className="mt-5"
          title={s.errorTitle}
          onDismiss={() => setFormError(null)}
        >
          {formError}
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <Input
          label={s.emailLabel}
          type="email"
          placeholder={s.emailPlaceholder}
          autoComplete="email"
          error={translateFieldError(errors.email?.message, t)}
          {...register("email")}
        />

        <div>
          <Input
            label={s.passwordLabel}
            type="password"
            placeholder={s.passwordPlaceholder}
            autoComplete="new-password"
            hint={s.passwordHint}
            error={translateFieldError(errors.password?.message, t)}
            {...register("password")}
          />
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {checks.map((check) => (
              <li
                key={check.label}
                className={cn(
                  "flex items-center gap-1 text-xs",
                  check.met ? "text-success-600" : "text-muted",
                )}
              >
                <span aria-hidden="true">{check.met ? "✓" : "○"}</span>
                {check.label}
              </li>
            ))}
          </ul>
        </div>

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? s.submitting : s.submit}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-muted">
        {s.termsPrefix}{" "}
        <span className="underline underline-offset-2">{s.termsLink}</span> {s.termsAnd}{" "}
        <span className="underline underline-offset-2">{s.privacyLink}</span>.
      </p>
    </div>
  );
}
