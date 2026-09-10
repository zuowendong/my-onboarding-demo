/** Shape of the translation dictionary — both locales implement this. */
export interface TranslationDictionary {
  common: {
    back: string;
    dismiss: string;
    stepOf: (current: number, total: number) => string;
    skip: string;
    continue: string;
    loading: string;
  };

  welcome: {
    heading: string;
    description: string;
    highlights: ReadonlyArray<{ title: string; body: string }>;
    cta: string;
    signInPrompt: string;
    signIn: string;
  };

  signup: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHint: string;
    submit: string;
    submitting: string;
    errorTitle: string;
    genericError: string;
    termsPrefix: string;
    termsLink: string;
    termsAnd: string;
    privacyLink: string;
    passwordChecks: {
      length: string;
      letter: string;
      number: string;
    };
  };

  verify: {
    title: string;
    description: (email: string) => string;
    submit: string;
    submitting: string;
    resendPrompt: string;
    resendIn: (seconds: number) => string;
    resend: string;
    resendSuccess: string;
    genericError: string;
    codeHint: string;
    noAccountTitle: string;
    noAccountDescription: string;
    noAccountAlert: string;
    noAccountCta: string;
    successTitle: string;
    successDescription: (email: string) => string;
    successCta: string;
  };

  profile: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    dobLabel: string;
    avatarLabel: string;
    avatarHint: string;
    submit: string;
    submitting: string;
    errorTitle: string;
    genericError: string;
  };

  plan: {
    title: string;
    description: string;
    submit: string;
    submitting: string;
    errorTitle: string;
    genericError: string;
    loadingPlans: string;
    perMonth: string;
    selectPlan: string;
    plans: Record<string, { name: string; description: string; features: string[] }>;
  };

  payment: {
    title: string;
    description: string;
    cardNameLabel: string;
    cardNamePlaceholder: string;
    cardNumberLabel: string;
    cardNumberPlaceholder: string;
    expiryLabel: string;
    expiryPlaceholder: string;
    cvcLabel: string;
    cvcPlaceholder: string;
    submit: string;
    submitting: string;
    skipForNow: string;
    errorTitle: string;
    genericError: string;
    skippedNote: string;
  };

  preferences: {
    title: string;
    description: string;
    interestsLabel: string;
    notificationsLabel: string;
    notificationsHint: string;
    submit: string;
    submitting: string;
    skipForNow: string;
    errorTitle: string;
    genericError: string;
    interests: Record<string, string>;
  };

  complete: {
    title: string;
    description: string;
    summaryTitle: string;
    email: string;
    name: string;
    plan: string;
    payment: string;
    interests: string;
    skipped: string;
    notSet: string;
    cta: string;
    startOver: string;
  };

  validation: {
    emailInvalid: string;
    passwordMin: string;
    passwordLetter: string;
    passwordNumber: string;
    codeInvalid: string;
    nameRequired: string;
    nameMin: string;
    dobRequired: string;
    dobInvalid: string;
    planRequired: string;
    cardNameRequired: string;
    cardNumberInvalid: string;
    expiryRequired: string;
    expiryInvalid: string;
    cvcRequired: string;
    cvcInvalid: string;
  };

  apiErrors: {
    emailTaken: string;
    emailTakenField: string;
    passwordCommon: string;
    passwordCommonField: string;
    codeExpired: string;
    codeIncorrect: string;
    codeIncorrectField: string;
    accountCreateFailed: string;
    profileSaveFailed: string;
    planSelectFailed: string;
    paymentFailed: string;
    preferencesSaveFailed: string;
    generic: string;
  };
}
