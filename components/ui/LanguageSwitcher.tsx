"use client";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/** Compact locale toggle — cycles between available languages. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cn("flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5", className)} role="group" aria-label="Language">
      {locales.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === code
              ? "bg-brand-600 text-white"
              : "text-muted hover:text-foreground",
          )}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
