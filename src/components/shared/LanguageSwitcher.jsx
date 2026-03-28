"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith("bn") ? "bn" : "en";

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "bn" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border
      bg-background/60 backdrop-blur-sm text-sm font-medium
      hover:bg-muted transition-all duration-200"
    >
      <Globe size={16} className="opacity-80" />
      <span>
        {currentLang === "en" ? "EN" : "BN"}
      </span>
    </button>
  );
}