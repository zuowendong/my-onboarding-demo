import { apiError, mockRequest } from "./client";
import type {
  SignupInput,
  SignupResult,
  VerifyInput,
  VerifyResult,
  ProfileInput,
  ProfileResult,
  Plan,
  PlanInput,
  PlanResult,
  PaymentInput,
  PaymentResult,
  PreferencesInput,
  PreferencesResult,
} from "./types";

/**
 * All error messages use i18n keys (prefixed "apiErrors.") so the display
 * layer can translate them. Field errors also use keys.
 */

const PLANS: Plan[] = [
  { id: "starter", price: 9 },
  { id: "pro", price: 19 },
  { id: "enterprise", price: 49 },
];

export const api = {
  /** POST /signup */
  signup({ email, password }: SignupInput): Promise<SignupResult> {
    return mockRequest(() => {
      const normalized = email.trim().toLowerCase();

      if (normalized === "taken@example.com") {
        throw apiError(409, "apiErrors.emailTaken", {
          email: "apiErrors.emailTakenField",
        });
      }
      if (password.toLowerCase() === "password") {
        throw apiError(422, "apiErrors.passwordCommon", {
          password: "apiErrors.passwordCommonField",
        });
      }

      const userId = `usr_${normalized.replace(/\W/g, "").slice(0, 8)}`;
      return { userId, email: normalized };
    });
  },

  /** POST /verify */
  verifyOtp({ code }: VerifyInput): Promise<VerifyResult> {
    return mockRequest(() => {
      if (code === "000000") {
        throw apiError(400, "apiErrors.codeExpired");
      }
      if (code !== "123456") {
        throw apiError(400, "apiErrors.codeIncorrect", {
          code: "apiErrors.codeIncorrectField",
        });
      }
      return { verified: true as const };
    });
  },

  /** POST /profile */
  saveProfile(_input: ProfileInput): Promise<ProfileResult> {
    return mockRequest(() => ({ saved: true as const }));
  },

  /** GET /plans */
  getPlans(): Promise<Plan[]> {
    return mockRequest(() => PLANS);
  },

  /** POST /plan-selection */
  selectPlan({ planId }: PlanInput): Promise<PlanResult> {
    return mockRequest(() => {
      if (!PLANS.some((p) => p.id === planId)) {
        throw apiError(400, "apiErrors.planSelectFailed");
      }
      return { planId };
    });
  },

  /** POST /payment */
  savePayment(_input: PaymentInput): Promise<PaymentResult> {
    return mockRequest(() => ({ saved: true as const }));
  },

  /** POST /preferences */
  savePreferences(_input: PreferencesInput): Promise<PreferencesResult> {
    return mockRequest(() => ({ saved: true as const }));
  },
};
