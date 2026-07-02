"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/providers";
import { getHomeMessages, getMarketsDetail, getMessages, getPageContent } from "@/lib/i18n";

export function useTranslations() {
  const { locale, currency } = useLocale();

  return useMemo(
    () => ({
      locale,
      currency,
      messages: getMessages(locale),
      home: getHomeMessages(locale),
      marketsDetail: getMarketsDetail(locale),
      page: (slug: string) => getPageContent(locale, slug),
    }),
    [locale, currency],
  );
}
