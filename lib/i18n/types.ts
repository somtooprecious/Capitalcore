export type Locale = "en" | "es" | "fr" | "de";

export type Currency = "USD" | "EUR" | "GBP";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export const CURRENCIES: { code: Currency; label: string; rate: number }[] = [
  { code: "USD", label: "US Dollar", rate: 1 },
  { code: "EUR", label: "Euro", rate: 0.92 },
  { code: "GBP", label: "British Pound", rate: 0.79 },
];
