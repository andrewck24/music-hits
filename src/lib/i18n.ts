import type {
  ArtistTranslations,
  CommonTranslations,
  HomeTranslations,
  SearchTranslations,
  SupportedLanguages,
  TrackTranslations,
} from "@/types/translations";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export interface LanguageConfig {
  code: SupportedLanguages;
  name: string;
  isDefault: boolean;
}

export const LANGUAGES: Record<SupportedLanguages, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    isDefault: true,
  },
  "zh-TW": {
    code: "zh-TW",
    name: "繁體中文",
    isDefault: false,
  },
  jp: {
    code: "jp",
    name: "日本語",
    isDefault: false,
  },
};

export const defaultNS = "common";

export const resources = {
  en: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
  "zh-TW": {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
  jp: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
    home: {} as HomeTranslations,
    search: {} as SearchTranslations,
  },
} as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Simple fallback to English only
    supportedLngs: ["en", "zh-TW", "jp"], // Only load these languages
    nonExplicitSupportedLngs: false, // Don't try to load variants like 'zh'
    load: "currentOnly", // Only load the current language, not variants
    debug: import.meta.env.DEV,
    defaultNS,
    ns: ["common", "artist", "track", "home", "search"],
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["navigator"], // Only detect from browser settings for Banner usage
      caches: [], // Don't cache to localStorage/cookie
    },
    react: {
      useSuspense: true,
      bindI18n: "languageChanged loaded", // Re-render on language change AND resource load
      bindI18nStore: "added removed", // Re-render when resources are added/removed
    },
  });

export default i18n;
