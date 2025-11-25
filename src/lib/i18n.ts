import type {
  ArtistTranslations,
  CommonTranslations,
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
  },
  "zh-TW": {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
  },
  jp: {
    common: {} as CommonTranslations,
    artist: {} as ArtistTranslations,
    track: {} as TrackTranslations,
  },
} as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      // All Chinese variants fallback to Traditional Chinese (zh-TW)
      zh: ["zh-TW", "en"],
      "zh-CN": ["zh-TW", "en"],
      "zh-Hans": ["zh-TW", "en"],
      "zh-Hant": ["zh-TW", "en"],
      // Default fallback to English
      default: ["en"],
    },
    debug: import.meta.env.DEV,
    defaultNS,
    ns: ["common", "artist", "track"],
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
