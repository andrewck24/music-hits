import { useCurrentLanguage } from "@/hooks/use-current-language";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSync() {
  const { i18n } = useTranslation();
  const currentLang = useCurrentLanguage();

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  return null;
}
