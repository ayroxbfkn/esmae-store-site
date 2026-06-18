"use client";

import { useLocale as useNextIntlLocale } from "next-intl";
import type { Locale, Direction } from "@/types";

interface LocaleInfo {
  locale: Locale;
  dir: Direction;
  isRTL: boolean;
  isArabic: boolean;
  dateLocale: string;
  numberLocale: string;
}

export function useLocaleInfo(): LocaleInfo {
  const locale = useNextIntlLocale() as Locale;
  const isArabic = locale === "ar";
  const isRTL = isArabic;

  const dateLocale = isArabic ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB";
  const numberLocale = isArabic ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US";

  return {
    locale,
    dir: isRTL ? "rtl" : "ltr",
    isRTL,
    isArabic,
    dateLocale,
    numberLocale,
  };
}
