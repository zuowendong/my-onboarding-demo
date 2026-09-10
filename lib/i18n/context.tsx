"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  LOCALE_STORAGE_KEY,
  locales,
  type Locale,
} from "./config";
import en from "./locales/en";
import zh from "./locales/zh";
import type { TranslationDictionary } from "./types";

const dictionaries: Record<Locale, TranslationDictionary> = { en, zh };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

// --- External store compatible with useSyncExternalStore ---

const LOCALE_CHANGE_EVENT = "lumen-locale-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);
  return () => window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
}

function getSnapshot(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return locales.includes(stored as Locale) ? (stored as Locale) : defaultLocale;
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
