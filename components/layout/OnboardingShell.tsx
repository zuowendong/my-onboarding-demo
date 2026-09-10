"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
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
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                    clipRule="evenodd"
                  />
                </svg>
                {t.common.back}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="7" className="fill-brand-600" />
      <path
        d="M12 6.5 13.6 10l3.9.4-2.9 2.6.9 3.8L12 14.8 8.5 16.8l.9-3.8L6.5 10.4 10.4 10 12 6.5Z"
        className="fill-white"
      />
    </svg>
  );
}
