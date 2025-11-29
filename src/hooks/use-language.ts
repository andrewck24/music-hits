import type { SupportedLanguages } from "@/types/translations";
import { createContext, useContext } from "react";

/**
 * Language context value provided to all children components
 */
export interface LanguageContextValue {
  /** Current validated language from URL */
  language: SupportedLanguages;
  /** Error state for language synchronization failures */
  error: Error | null;
}

/**
 * Language context for accessing current language across the app
 * @internal - Use useLanguage() hook instead of accessing context directly
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Hook to access current language from LanguageProvider context
 *
 * Must be used within a LanguageProvider component tree.
 * Provides the validated current language and any sync errors.
 *
 * @returns Current language and error state
 * @throws Error if used outside LanguageProvider
 *
 * @example
 * ```tsx
 * function NavigationLinks() {
 *   const { language, error } = useLanguage();
 *
 *   if (error) {
 *     console.warn("Language sync error:", error);
 *   }
 *
 *   return (
 *     <nav>
 *       <Link to={`/${language}/about`}>About</Link>
 *       <Link to={`/${language}/contact`}>Contact</Link>
 *     </nav>
 *   );
 * }
 * ```
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
