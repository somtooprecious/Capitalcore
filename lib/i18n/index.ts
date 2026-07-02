import type { Currency, Locale } from "@/lib/i18n/types";
import { CURRENCIES, LOCALES } from "@/lib/i18n/types";
import { getMessages, SLUG_TO_PAGE_KEY } from "@/lib/i18n/messages";
import { getHomeMessages } from "@/lib/i18n/home-messages";
import { getMarketsDetail } from "@/lib/i18n/markets-messages";

export type { Currency, Locale };
export { CURRENCIES, LOCALES, getMessages, SLUG_TO_PAGE_KEY, getHomeMessages, getMarketsDetail };

export function getPageContent(locale: Locale, slug: string) {
  const key = SLUG_TO_PAGE_KEY[slug];
  if (!key) return null;
  return getMessages(locale).pages[key];
}

export function convertCurrency(amountUsd: number, currency: Currency) {
  const row = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  return amountUsd * row.rate;
}

export function formatCurrency(amountUsd: number, currency: Currency) {
  const converted = convertCurrency(amountUsd, currency);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(converted);
}
