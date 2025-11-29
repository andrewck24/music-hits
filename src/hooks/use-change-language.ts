import { useLanguage } from "@/hooks/use-language";
import type { SupportedLanguages } from "@/types/translations";
import { useLocation, useNavigate } from "react-router-dom";

export function useChangeLanguage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language: currentLang } = useLanguage();

  const changeLanguage = (newLang: SupportedLanguages) => {
    if (newLang === currentLang) return;

    let newPath = location.pathname;

    // Remove current language prefix (all languages have prefix)
    newPath = newPath.replace(new RegExp(`^/${currentLang}`), "");

    // Ensure path starts with /
    if (!newPath.startsWith("/")) {
      newPath = "/" + newPath;
    }

    // Add new language prefix (all languages use prefix)
    newPath = `/${newLang}${newPath}`;

    // Navigate with preserved query parameters and hash
    navigate({
      pathname: newPath,
      search: location.search,
      hash: location.hash,
    });
  };

  return changeLanguage;
}
