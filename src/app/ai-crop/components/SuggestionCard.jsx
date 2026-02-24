"use client";

import { useEffect, useState } from "react";

export default function SuggestionCard({ weather }) {
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (!weather) return;

    const temp = weather?.main?.temp;
    const humidity = weather?.main?.humidity;

    const getCropSuggestion = () => {
      if (temp >= 30 && humidity > 60)
        return "🌾 Rice, Jute, Sugarcane are suitable for hot & humid weather.";

      if (temp >= 20 && temp < 30 && humidity >= 40)
        return "🌽 Maize, Vegetables, Papaya grow well in moderate climate.";

      if (temp < 20)
        return "🥔 Wheat, Potato, Mustard are ideal for cooler weather.";

      return "🌱 Mixed seasonal vegetables recommended.";
    };

    setSuggestion(getCropSuggestion());
  }, [weather]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow h-full">

      <h2 className="text-xl font-semibold mb-4">
        🌱 Smart Crop Recommendation
      </h2>

      <p className="text-green-700 font-bold">
        {suggestion || "Weather based crop suggestion will appear here"}
      </p>

    </div>
  );
}