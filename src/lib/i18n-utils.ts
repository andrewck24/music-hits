import type { SupportedLanguages } from "@/types/translations";

/**
 * Supported language codes for the application
 * Used across i18n configuration, routing, and language validation
 */
export const SUPPORTED_LANGUAGES = ["en", "zh-TW", "jp"] as const;

/**
 * Type guard to check if a string is a valid supported language code
 *
 * @param lang - Language code to validate
 * @returns True if the language is supported
 *
 * @example
 * ```ts
 * const urlLang = params.lang;
 * if (isValidLanguage(urlLang)) {
 *   // TypeScript now knows urlLang is SupportedLanguages
 *   i18n.changeLanguage(urlLang);
 * }
 * ```
 */
export function isValidLanguage(lang: string): lang is SupportedLanguages {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguages);
}

/**
 * Detect browser language for SEO-optimized routing
 *
 * Checks navigator.languages and navigator.language to determine
 * the user's preferred language, mapping browser locales to supported languages.
 *
 * Language Mapping:
 * - Chinese (zh, zh-TW, zh-Hant) → "zh-TW"
 * - Japanese (ja, jp) → "jp"
 * - All others → "en"
 *
 * @returns Detected language code, defaults to "en"
 *
 * @example
 * ```ts
 * const browserLang = getLangFromBrowser();
 * // Returns: "zh-TW" | "jp" | "en"
 *
 * const targetLang = ["zh-TW", "jp"].includes(browserLang) ? browserLang : "en";
 * navigate(`/${targetLang}/`);
 * ```
 */
export function getLangFromBrowser(): SupportedLanguages {
  // Server-side rendering guard
  if (typeof navigator === "undefined") {
    return "en";
  }

  const languages = navigator.languages || [navigator.language];

  for (const lang of languages) {
    const normalized = lang.toLowerCase();

    // Traditional Chinese matching
    if (
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hant") ||
      normalized === "zh"
    ) {
      return "zh-TW";
    }

    // Japanese matching
    if (normalized.startsWith("ja") || normalized.startsWith("jp")) {
      return "jp";
    }
  }

  return "en";
}
