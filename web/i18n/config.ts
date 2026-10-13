export const LOCALES = ['en', 'fr', 'nl'] as const;

export type Locale = (typeof LOCALES)[number];

/** English is the source language and the language of B2B produce trading. */
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
};

/** `hreflang` values — plain language codes: the site targets no single country. */
export const LOCALE_HREFLANG: Record<Locale, string> = { en: 'en', fr: 'fr', nl: 'nl' };

/** Open Graph locales. */
export const LOCALE_OG: Record<Locale, string> = { en: 'en_GB', fr: 'fr_FR', nl: 'nl_NL' };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const SITE_URL = 'https://euraviafoods.com';
