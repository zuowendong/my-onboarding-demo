"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  paymentSchema,
  translateFieldError,
  type PaymentFormValues,
} from "@/lib/validation/schemas";

export default function PaymentPage() {
  const hydrated = useOnboardingHydrated();
  if (!hydrated) return <ScreenSkeleton />;
  return <PaymentForm />;
}

function PaymentForm() {
  const { next, skip } = useOnboarding();
  const { t } = useLocale();
  const p = t.payment;
  const updateData = useOnboardingStore((state) => state.updateData);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { cardName: "", cardNumber: "", expiry: "", cvc: "" },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.savePayment(values);
      updateData({ paymentAdded: true });
      next();
    } catch (err) {
      if (isApiError(err)) {
        setFormError(translateFieldError(err.message, t) ?? p.genericError);
      } else {
        setFormError(p.genericError);
      }
    }
  });

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

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <Input
          label={p.cardNameLabel}
          type="text"
          placeholder={p.cardNamePlaceholder}
          autoComplete="cc-name"
          error={translateFieldError(errors.cardName?.message, t)}
          {...register("cardName")}
        />

        <Input
          label={p.cardNumberLabel}
          type="text"
          placeholder={p.cardNumberPlaceholder}
          autoComplete="cc-number"
          inputMode="numeric"
          error={translateFieldError(errors.cardNumber?.message, t)}
          {...register("cardNumber")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={p.expiryLabel}
            type="text"
            placeholder={p.expiryPlaceholder}
            autoComplete="cc-exp"
            inputMode="numeric"
            error={translateFieldError(errors.expiry?.message, t)}
            {...register("expiry")}
          />
          <Input
            label={p.cvcLabel}
            type="text"
            placeholder={p.cvcPlaceholder}
            autoComplete="cc-csc"
            inputMode="numeric"
            error={translateFieldError(errors.cvc?.message, t)}
            {...register("cvc")}
          />
        </div>

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? p.submitting : p.submit}
        </Button>
      </form>

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
