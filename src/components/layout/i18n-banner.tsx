import { useBannerState } from "@/hooks/use-banner-state";
import { useChangeLanguage } from "@/hooks/use-change-language";
import { useDetectedBrowserLanguage } from "@/hooks/use-language-detection";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Language suggestion banner component.
 *
 * Displays a banner when the detected browser language differs from the current URL language.
 * Only shown once per user (uses localStorage to remember dismissed state).
 *
 * Features:
 * - Detects browser language using i18next-browser-languagedetector
 * - Compares with current URL language
 * - Provides "Switch" and "Dismiss" buttons
 * - Remembers dismissed state across sessions
 * - Gracefully handles Safari private mode
 *
 * @example
 * ```tsx
 * // In App.tsx or routes.tsx
 * function App() {
 *   return (
 *     <>
 *       <I18nBanner />
 *       <Header />
 *       <main>{children}</main>
 *     </>
 *   );
 * }
 * ```
 */
export function I18nBanner() {
  const { t } = useTranslation("common");
  const { language: currentLang } = useLanguage();
  const detectedLang = useDetectedBrowserLanguage();
  const { isDismissed, dismiss } = useBannerState();
  const changeLanguage = useChangeLanguage();

  const shouldShowBanner =
    !isDismissed && detectedLang && detectedLang !== currentLang;

  if (!shouldShowBanner) return null;

  const detectedLangName = LANGUAGES[detectedLang].name;

  const handleSwitch = () => {
    changeLanguage(detectedLang);
    dismiss();
  };

  return (
    <div className="top-header-height bg-primary fixed z-40 w-full shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            <p className="text-primary-foreground text-sm font-medium sm:text-base">
              {t("banner.message", { language: detectedLangName })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitch}
            className="bg-background text-foreground hover:bg-card focus:ring-foreground focus:ring-offset-primary rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {t("banner.switchButton", { language: detectedLangName })}
          </button>

          <button
            onClick={dismiss}
            className="text-primary-foreground hover:bg-primary/80 focus:ring-foreground focus:ring-offset-primary rounded-md p-1.5 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label={t("banner.dismissButton")}
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
