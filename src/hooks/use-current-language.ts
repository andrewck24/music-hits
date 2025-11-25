import type { SupportedLanguages } from "@/types/translations";
import { useLocation } from "react-router-dom";

function isValidLanguage(lang: string): lang is SupportedLanguages {
  return ["en", "zh-TW", "jp"].includes(lang);
}

function getLangFromUrl(pathname: string): SupportedLanguages {
  const match = pathname.match(/^\/(zh-TW|jp)(?:\/|$)/);
  if (match && isValidLanguage(match[1])) {
    return match[1] as SupportedLanguages;
  }
  return "en";
}

export function useCurrentLanguage(): SupportedLanguages {
  const location = useLocation();
  return getLangFromUrl(location.pathname);
}
