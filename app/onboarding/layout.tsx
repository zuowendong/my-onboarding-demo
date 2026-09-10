import type { Metadata } from "next";
import type { ReactNode } from "react";
import { OnboardingShell } from "@/components/layout/OnboardingShell";

export const metadata: Metadata = {
  title: "Onboarding · Lumen",
  description: "Account setup flow demo — React, TypeScript, Tailwind CSS.",
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
