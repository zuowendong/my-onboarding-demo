/**
 * Request/response DTOs for the mock backend.
 * Error messages use i18n keys (prefixed "apiErrors.") resolved at the display layer.
 */

/** Typed API error. Screens use it to split inline field errors from a global banner. */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface SignupResult {
  userId: string;
  email: string;
}

export interface VerifyInput {
  email: string;
  code: string;
}

export interface VerifyResult {
  verified: true;
}

export interface ProfileInput {
  name: string;
  dob: string;
  avatar?: string;
}

export interface ProfileResult {
  saved: true;
}

export interface Plan {
  id: string;
  price: number;
}

export interface PlanInput {
  planId: string;
}

export interface PlanResult {
  planId: string;
}

export interface PaymentInput {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface PaymentResult {
  saved: true;
}

export interface PreferencesInput {
  interests: string[];
  notifications: boolean;
}

export interface PreferencesResult {
  saved: true;
}
