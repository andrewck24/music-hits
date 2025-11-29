import { LanguageContext } from "@/hooks/use-language";
import { getLangFromBrowser, isValidLanguage } from "@/lib/i18n-utils";
import type { SupportedLanguages } from "@/types/translations";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useParams } from "react-router-dom";

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Language Provider - Central language management with React Context
 *
 * Features:
 * 1. URL Language Extraction - Reads :lang parameter from React Router
 * 2. Language Validation - Validates language against supported languages
 * 3. Invalid Language Redirection - Redirects to browser language or English
 * 4. i18next Synchronization - Syncs URL language to i18next using official API
 * 5. Error State Management - Tracks language sync errors for UX improvements
 *
 * Architecture:
 * - Integrates validation, redirection, and sync logic in one Provider
 * - Uses official i18n.changeLanguage() API for synchronization
 * - Provides validated language via Context to all child components
 * - Eliminates need for multiple hooks (useCurrentLanguage, useLanguageSync, useLanguageValidator)
 *
 * @component
 * @example
 * ```tsx
 * // In Layout component
 * export function Layout() {
 *   return (
 *     <LanguageProvider>
 *       <Header />
 *       <Outlet />
 *     </LanguageProvider>
 *   );
 * }
 *
 * // In any child component
 * function SomeComponent() {
 *   const { language } = useLanguage();
 *   return <div>Current language: {language}</div>;
 * }
 * ```
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const params = useParams<{ lang: string }>();
  const location = useLocation();

  const urlLang = params.lang;
  const isValid = urlLang && isValidLanguage(urlLang);

  // Invalid language redirection logic
  if (!isValid) {
    const browserLang = getLangFromBrowser();
    const targetLang = ["zh-TW", "jp"].includes(browserLang)
      ? browserLang
      : "en";

    // Extract path without language prefix
    let pathWithoutLang = location.pathname;

    // Remove invalid language prefix if exists
    if (urlLang) {
      pathWithoutLang = pathWithoutLang.replace(new RegExp(`^/${urlLang}`), "");
    }

    // Ensure path starts with /
    if (!pathWithoutLang.startsWith("/")) {
      pathWithoutLang = "/" + pathWithoutLang;
    }

    // Build redirect path with valid language, preserving search params and hash
    const redirectTo = `/${targetLang}${pathWithoutLang}${location.search}${location.hash}`;

    return <Navigate to={redirectTo} replace />;
  }

  const validLang = urlLang as SupportedLanguages;

  // Delegate to inner component to satisfy React Hooks rules
  return (
    <LanguageProviderInner language={validLang}>
      {children}
    </LanguageProviderInner>
  );
}

/**
 * Inner provider component that handles i18next sync and context provision
 * Separated to satisfy React Hooks rules (no hooks after early returns)
 */
function LanguageProviderInner({
  language,
  children,
}: {
  language: SupportedLanguages;
  children: ReactNode;
}) {
  const { i18n } = useTranslation();
  const [error, setError] = useState<Error | null>(null);

  // Sync URL language to i18next using official API
  useEffect(() => {
    // Skip if already in sync
    if (i18n.language === language) {
      return;
    }

    const syncLanguage = async () => {
      try {
        await i18n.changeLanguage(language);
        setError(null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[LanguageProvider] Failed to sync language:", err);
        setError(err as Error);
      }
    };

    void syncLanguage();
  }, [i18n, language]);

  return (
    <LanguageContext.Provider value={{ language, error }}>
      {children}
    </LanguageContext.Provider>
  );
}
