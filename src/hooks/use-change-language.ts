import type { SupportedLanguages } from "@/types/translations";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentLanguage } from "./use-current-language";

export function useChangeLanguage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = useCurrentLanguage();

  const changeLanguage = (newLang: SupportedLanguages) => {
    if (newLang === currentLang) return;

    let newPath = location.pathname;

    // Remove current language prefix
    if (currentLang !== "en") {
      newPath = newPath.replace(new RegExp(`^/${currentLang}`), "");
    }

    // Ensure path starts with /
    if (!newPath.startsWith("/")) {
      newPath = "/" + newPath;
    }

    // Add new language prefix (default language doesn't have prefix)
    if (newLang !== "en") {
      newPath = `/${newLang}${newPath}`;
    }

    // Navigate with preserved query parameters and hash
    navigate({
      pathname: newPath,
      search: location.search,
      hash: location.hash,
    });
  };

  return changeLanguage;
}
