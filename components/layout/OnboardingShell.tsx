"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { BrandMark, ChevronLeftIcon } from "@/components/ui/icons";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useLocale } from "@/lib/i18n/context";

/**
 * Shared shell for every onboarding screen: brand header, segmented progress,
 * a centered card, and the Back control (hidden on the first step).
 * Mobile-first; the card is full-bleed on phones and centered on desktop.
 */
export function OnboardingShell({ children }: { children: ReactNode }) {
  const { currentIndex, totalSteps, isFirst, back } = useOnboarding();
  const { t } = useLocale();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/onboarding/welcome"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <BrandMark className="h-6 w-6" />
          <span>Lumen</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tabular-nums text-muted">
            {t.common.stepOf(Math.max(currentIndex + 1, 1), totalSteps)}
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-10 sm:items-center">
        <div className="w-full max-w-md">
          <ProgressBar total={totalSteps} current={currentIndex} className="mb-6" />
          <Card>{children}</Card>
          <div className="mt-6 flex justify-center">
            {!isFirst && (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {t.common.back}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
