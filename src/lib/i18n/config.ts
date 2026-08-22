/**
 * i18n Configuration for next-intl
 * Defines supported locales and routing configuration
 */

export const locales = ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'zh-TW', 'pt', 'ar', 'it', 'id', 'vi', 'ro', 'hi', 'te', 'ta', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'or', 'ur'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeConfig: Record<Locale, {
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
}> = {
  en: { name: 'English', nativeName: 'English', direction: 'ltr', dateFormat: 'MM/DD/YYYY' },
  ja: { name: 'Japanese', nativeName: '日本語', direction: 'ltr', dateFormat: 'YYYY/MM/DD' },
  ko: { name: 'Korean', nativeName: '한국어', direction: 'ltr', dateFormat: 'YYYY.MM.DD' },
  es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  fr: { name: 'French', nativeName: 'Français', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  de: { name: 'German', nativeName: 'Deutsch', direction: 'ltr', dateFormat: 'DD.MM.YYYY' },
  zh: { name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', dateFormat: 'YYYY-MM-DD' },
  'zh-TW': { name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', dateFormat: 'YYYY/MM/DD' },
  pt: { name: 'Portuguese', nativeName: 'Português', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  ar: { name: 'Arabic', nativeName: 'العربية', direction: 'rtl', dateFormat: 'DD/MM/YYYY' },
  it: { name: 'Italian', nativeName: 'Italiano', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  ro: { name: 'Romanian', nativeName: 'Română', direction: 'ltr', dateFormat: 'DD.MM.YYYY' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  mr: { name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr', dateFormat: 'DD/MM/YYYY' },
  ur: { name: 'Urdu', nativeName: 'اردو', direction: 'rtl', dateFormat: 'DD/MM/YYYY' },
};

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return localeConfig[locale].direction === 'rtl';
}

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale from path
 */
export function getLocaleFromPath(path: string): Locale | null {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return null;
}

/**
 * Generate localized path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove any existing locale prefix (must be followed by / or end of string)
  const cleanPath = path.replace(/^\/(en|ja|ko|es|fr|de|zh-TW|zh|pt|ar|it|id|vi|ro|hi|te|ta|kn|ml|bn|mr|gu|pa|or|ur)(\/|$)/, '/');
  // Normalize the path - ensure it starts with / and handle empty paths
  const normalizedPath = cleanPath === '/' ? '/' : cleanPath.replace(/^\/+/, '/');
  // Add the new locale prefix
  return `/${locale}${normalizedPath === '/' ? '/' : normalizedPath}`;
}
