import { useTranslation } from "react-i18next";
import type { SupportedLanguages } from "@/types/translations";

/**
 * Detects the user's browser language using i18next-browser-languagedetector.
 *
 * Returns the detected language if it's supported, otherwise returns null.
 * This hook is used ONLY for displaying the language suggestion banner,
 * NOT for actually changing the application language (which is determined by URL).
 *
 * @returns The detected supported language code, or null if unsupported
 *
 * @example
 * ```tsx
 * function I18nBanner() {
 *   const currentLang = useCurrentLanguage(); // from URL
 *   const detectedLang = useDetectedBrowserLanguage(); // from browser
 *
 *   const shouldShowBanner = detectedLang && detectedLang !== currentLang;
 *
 *   if (!shouldShowBanner) return null;
 *
 *   return <div>Switch to {detectedLang}?</div>;
 * }
 * ```
 */
export function useDetectedBrowserLanguage(): SupportedLanguages | null {
  const { i18n } = useTranslation();

  const detectedLang = i18n.services.languageDetector?.detect();

  if (typeof detectedLang === "string" && isValidLanguage(detectedLang)) {
    return detectedLang as SupportedLanguages;
  }

  if (
    Array.isArray(detectedLang) &&
    detectedLang.length > 0 &&
    typeof detectedLang[0] === "string" &&
    isValidLanguage(detectedLang[0])
  ) {
    return detectedLang[0] as SupportedLanguages;
  }

  return null;
}

function isValidLanguage(lang: string): lang is SupportedLanguages {
  return ["en", "zh-TW", "jp"].includes(lang);
}
