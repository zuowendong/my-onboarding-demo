"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useOnboardingStore } from "@/store/onboarding-store";
import {
  ONBOARDING_STEPS,
  findStepIndex,
  type StepKey,
} from "@/types/onboarding";

/**
 * Navigation + step awareness for the flow. Screens stay dumb and
 * call `next` / `back` / `skip` / `goTo` / `restart`; the shell reads
 * `currentIndex` to render the progress indicator.
 */
export function useOnboarding() {
  const pathname = usePathname();
  const router = useRouter();
  const reset = useOnboardingStore((state) => state.reset);
  const markSkipped = useOnboardingStore((state) => state.markSkipped);

  const currentIndex = findStepIndex(pathname);
  const currentStep = currentIndex >= 0 ? ONBOARDING_STEPS[currentIndex] : undefined;
  const isFirst = currentIndex <= 0;

  const goTo = useCallback(
    (key: StepKey) => {
      const step = ONBOARDING_STEPS.find((s) => s.key === key);
      if (step) router.push(step.href);
    },
    [router],
  );

  const next = useCallback(() => {
    const nextStep = ONBOARDING_STEPS[currentIndex + 1];
    if (nextStep) router.push(nextStep.href);
  }, [currentIndex, router]);

  const back = useCallback(() => {
    if (currentIndex > 0) {
      router.push(ONBOARDING_STEPS[currentIndex - 1].href);
    } else {
      router.push("/");
    }
  }, [currentIndex, router]);

  const skip = useCallback(() => {
    if (currentStep) markSkipped(currentStep.key);
    next();
  }, [currentStep, markSkipped, next]);

  const restart = useCallback(() => {
    reset();
    router.push("/onboarding/welcome");
  }, [reset, router]);

  return {
    currentIndex,
    currentStep,
    totalSteps: ONBOARDING_STEPS.length,
    isFirst,
    goTo,
    next,
    back,
    skip,
    restart,
  };
}
