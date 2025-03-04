import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";
import sprintf from "i18next-sprintf-postprocessor";

i18n
  .use(sprintf)
  .use(ICU)
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "zh-CN"],
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: `${import.meta.env.VITE_B6_ROOT_URL}/locales/{{lng}}/{{ns}}`,
    },
  });

export default i18n;
