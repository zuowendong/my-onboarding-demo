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
  profileSchema,
  translateFieldError,
  type ProfileFormValues,
} from "@/lib/validation/schemas";

export default function ProfilePage() {
  const hydrated = useOnboardingHydrated();
  const name = useOnboardingStore((state) => state.data.name);
  const dob = useOnboardingStore((state) => state.data.dob);

  if (!hydrated) return <ScreenSkeleton />;
  return <ProfileForm defaultName={name} defaultDob={dob} />;
}

function ProfileForm({
  defaultName,
  defaultDob,
}: {
  defaultName: string;
  defaultDob: string;
}) {
  const { next } = useOnboarding();
  const { t } = useLocale();
  const p = t.profile;
  const updateData = useOnboardingStore((state) => state.updateData);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: defaultName, dob: defaultDob },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await api.saveProfile(values);
      updateData({ name: values.name, dob: values.dob });
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
          label={p.nameLabel}
          type="text"
          placeholder={p.namePlaceholder}
          autoComplete="name"
          error={translateFieldError(errors.name?.message, t)}
          {...register("name")}
        />

        <Input
          label={p.dobLabel}
          type="date"
          error={translateFieldError(errors.dob?.message, t)}
          {...register("dob")}
        />

        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          {isSubmitting ? p.submitting : p.submit}
        </Button>
      </form>
    </div>
  );
}
