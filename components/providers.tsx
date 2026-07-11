"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { LiveChatWidget } from "@/components/live-chat-widget";
import { SitePreloader } from "@/components/site-preloader";
import type { Currency, Locale } from "@/lib/i18n";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

type LocaleContextValue = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const LocaleContext = createContext<LocaleContextValue | null>(null);

function LocalePreferencesSync({
  setLocaleState,
  setCurrencyState,
}: {
  setLocaleState: (locale: Locale) => void;
  setCurrencyState: (currency: Currency) => void;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    void fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data: { preferences?: { preferredLanguage?: string; preferredCurrency?: string } }) => {
        const p = data.preferences;
        if (p?.preferredLanguage && ["en", "es", "fr", "de"].includes(p.preferredLanguage)) {
          setLocaleState(p.preferredLanguage as Locale);
        }
        if (p?.preferredCurrency && ["USD", "EUR", "GBP"].includes(p.preferredCurrency)) {
          setCurrencyState(p.preferredCurrency as Currency);
        }
      });
  }, [isLoaded, isSignedIn, setLocaleState, setCurrencyState]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (window.localStorage.getItem("capitalcore-theme") as Theme | null) ?? "dark";
  });
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("capitalcore-locale") as Locale | null) ?? "en";
  });
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const stored = window.localStorage.getItem("capitalcore-currency");
    if (stored === "USD" || stored === "EUR" || stored === "GBP") return stored;
    return "USD";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("capitalcore-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("capitalcore-locale", locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem("capitalcore-currency", currency);
  }, [currency]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    void fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLanguage: next }),
    });
  };

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    void fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredCurrency: next }),
    });
  };

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  const localeValue = useMemo(
    () => ({ locale, currency, setLocale, setCurrency }),
    [locale, currency],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={themeValue}>
        <LocaleContext.Provider value={localeValue}>
          <LocalePreferencesSync setLocaleState={setLocaleState} setCurrencyState={setCurrencyState} />
          <SitePreloader />
          {children}
          <LiveChatWidget />
          <Toaster richColors position="top-right" theme={theme} />
        </LocaleContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside Providers");
  }
  return ctx;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside Providers");
  }
  return ctx;
}
