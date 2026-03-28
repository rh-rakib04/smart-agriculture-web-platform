"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/i18n/locales/en/common.json";
import bn from "@/i18n/locales/bn/common.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: en,
        },
        bn: {
          translation: bn,
        },
      },
      fallbackLng: "en",
      lng: "en", // 🔥 ADD THIS (IMPORTANT FIX)
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;