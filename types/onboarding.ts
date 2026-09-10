/**
 * Domain types & step definitions for the onboarding flow.
 */

export type StepKey =
  | "welcome"
  | "signup"
  | "verify"
  | "profile"
  | "plan"
  | "payment"
  | "preferences"
  | "complete";

export type PlanId = "starter" | "pro" | "enterprise";

/**
 * Data retained across steps. The password is deliberately NOT stored here —
 * it is only ever held in the sign-up form and sent to the API.
 */
export interface OnboardingData {
  email: string;
  verified: boolean;
  name: string;
  dob: string;
  plan: PlanId | null;
  paymentAdded: boolean;
  interests: string[];
  notifications: boolean;
}

export interface StepMeta {
  key: StepKey;
  label: string;
  href: string;
}

export const ONBOARDING_STEPS: readonly StepMeta[] = [
  { key: "welcome", label: "Welcome", href: "/onboarding/welcome" },
  { key: "signup", label: "Account", href: "/onboarding/signup" },
  { key: "verify", label: "Verify", href: "/onboarding/verify" },
  { key: "profile", label: "Profile", href: "/onboarding/profile" },
  { key: "plan", label: "Plan", href: "/onboarding/plan" },
  { key: "payment", label: "Payment", href: "/onboarding/payment" },
  { key: "preferences", label: "Preferences", href: "/onboarding/preferences" },
  { key: "complete", label: "Done", href: "/onboarding/complete" },
] as const;

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  email: "",
  verified: false,
  name: "",
  dob: "",
  plan: null,
  paymentAdded: false,
  interests: [],
  notifications: true,
};

/** Resolve the active step index (0-based) from the current pathname. */
export function findStepIndex(pathname: string): number {
  return ONBOARDING_STEPS.findIndex((step) => pathname.startsWith(step.href));
}
