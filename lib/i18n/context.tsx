"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/demos";
import { en, type Dictionary } from "./dict/en";
import { tr } from "./dict/tr";

const DICTS: Record<Locale, Dictionary> = { en, tr };
const STORAGE_KEY = "ea-locale";

interface LanguageValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // hydrate from storage / browser once on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "tr") {
      setLocaleState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith("tr")) {
      setLocaleState("tr");
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "tr" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, t: DICTS[locale], setLocale, toggle }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

/** Shorthand for the active dictionary. */
export function useT(): Dictionary {
  return useLanguage().t;
}
