import { z } from "zod";
import type { TranslationDictionary } from "@/lib/i18n/types";

type PasswordCheckLabels = TranslationDictionary["signup"]["passwordChecks"];

/** Sign-up form: email + password. */
export const signupSchema = z.object({
  email: z.email("validation.emailInvalid"),
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .regex(/[A-Za-z]/, "validation.passwordLetter")
    .regex(/[0-9]/, "validation.passwordNumber"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

/** Email verification: a 6-digit one-time code. */
export const verifySchema = z.object({
  code: z.string().regex(/^[0-9]{6}$/, "validation.codeInvalid"),
});

export type VerifyFormValues = z.infer<typeof verifySchema>;

/** Profile setup: name + date of birth. */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .min(2, "validation.nameMin"),
  dob: z
    .string()
    .min(1, "validation.dobRequired")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dobInvalid"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

/** Payment form: card details. */
export const paymentSchema = z.object({
  cardName: z.string().min(1, "validation.cardNameRequired"),
  cardNumber: z
    .string()
    .regex(/^[\d\s]{13,19}$/, "validation.cardNumberInvalid"),
  expiry: z
    .string()
    .min(1, "validation.expiryRequired")
    .regex(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/, "validation.expiryInvalid"),
  cvc: z
    .string()
    .min(1, "validation.cvcRequired")
    .regex(/^\d{3,4}$/, "validation.cvcInvalid"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export interface PasswordCheck {
  label: string;
  met: boolean;
}

/** Live password-requirement checklist. */
export function getPasswordChecks(
  password: string,
  labels: PasswordCheckLabels,
): PasswordCheck[] {
  return [
    { label: labels.length, met: password.length >= 8 },
    { label: labels.letter, met: /[A-Za-z]/.test(password) },
    { label: labels.number, met: /[0-9]/.test(password) },
  ];
}

/**
 * Resolve a zod error message or API error that may be a translation key
 * (e.g. "validation.emailInvalid" or "apiErrors.codeExpired")
 * into the user-facing localized string. Non-key messages pass through.
 */
export function translateFieldError(
  message: string | undefined,
  t: TranslationDictionary,
): string | undefined {
  if (!message) return undefined;
  if (message.startsWith("validation.")) {
    const key = message.slice("validation.".length) as keyof TranslationDictionary["validation"];
    const resolved = t.validation[key];
    return typeof resolved === "string" ? resolved : message;
  }
  if (message.startsWith("apiErrors.")) {
    const key = message.slice("apiErrors.".length) as keyof TranslationDictionary["apiErrors"];
    const resolved = t.apiErrors[key];
    return typeof resolved === "string" ? resolved : message;
  }
  return message;
}
