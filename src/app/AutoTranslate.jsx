"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AutoTranslate() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const translatePage = async () => {
      if (i18n.language === "en") return;

      const elements = document.querySelectorAll("h1, h2, h3, h4, p, span, a, button");

      for (let el of elements) {
        const text = el.innerText;

        if (!text || text.length < 2) continue;

        try {
          const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            body: JSON.stringify({
              q: text,
              source: "en",
              target: i18n.language,
              format: "text",
            }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          el.innerText = data.translatedText;
        } catch (err) {
          // fallback ignore
        }
      }
    };

    setTimeout(translatePage, 500); // wait for render
  }, [i18n.language]);

  return null;
}