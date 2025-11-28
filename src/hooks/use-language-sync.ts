import { getLangFromUrl } from "@/hooks/use-current-language";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface UseLanguageSyncResult {
  isReady: boolean;
  error: Error | null;
}

/**
 * Language Sync Hook
 *
 * 監聽路由變化並同步 i18n 語言
 *
 * 使用場景:
 * - 瀏覽器前進/後退導航
 * - 手動點擊語言切換
 * - 所有非首次載入的路由導航
 *
 * 架構說明:
 * - useLanguageSync: 後續導航的語言同步
 * - 使用 i18next 事件系統追蹤語言切換狀態
 *
 * @returns {boolean} ready - 翻譯是否已載入完成
 * @returns {Error | null} error - 語言切換過程中的錯誤
 */

export function useLanguageSync(): UseLanguageSyncResult {
  const { i18n } = useTranslation();
  const location = useLocation();
  const urlLang = getLangFromUrl(location.pathname);
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (i18n.language === urlLang) {
      setIsReady(true);
      return;
    }

    setIsReady(false);

    const switchLanguage = async () => {
      try {
        await i18n.changeLanguage(urlLang);
        setIsReady(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[useLanguageSwitch] Failed to switch language:", error);
        setError(error as Error);
        setIsReady(true);
      }
    };

    void switchLanguage();
  }, [i18n, urlLang]);

  return { isReady, error };
}
