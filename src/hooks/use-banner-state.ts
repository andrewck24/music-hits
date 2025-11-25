import { useState } from "react";

/**
 * Manages the dismissed state of the i18n banner using localStorage.
 *
 * Stores whether the user has dismissed the language suggestion banner.
 * Handles Safari private mode gracefully by falling back to in-memory state.
 *
 * @returns An object containing:
 *   - isDismissed: Whether the banner has been dismissed
 *   - dismiss: Function to dismiss the banner
 *   - reset: Function to reset the dismissed state
 *
 * @example
 * ```tsx
 * function I18nBanner() {
 *   const { isDismissed, dismiss } = useBannerState();
 *
 *   if (isDismissed) return null;
 *
 *   return (
 *     <div>
 *       <p>Switch language?</p>
 *       <button onClick={dismiss}>Dismiss</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBannerState() {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("i18n_banner_dismissed") === "true";
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem("i18n_banner_dismissed", "true");
      setIsDismissed(true);
    } catch {
      setIsDismissed(true);
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem("i18n_banner_dismissed");
      setIsDismissed(false);
    } catch {
      setIsDismissed(false);
    }
  };

  return { isDismissed, dismiss, reset };
}
