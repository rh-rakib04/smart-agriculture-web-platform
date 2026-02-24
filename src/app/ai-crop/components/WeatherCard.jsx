"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// SSR Safe Dynamic Imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [position, setPosition] = useState(null);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "3024bd355587845b847a963c349a2a48";

  // ✅ Load Leaflet only in browser
  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setMarkerIcon(icon);
    });
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName || loading) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName},BD&appid=${API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);

      setWeather(data);
      setPosition([data.coord.lat, data.coord.lon]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const detectLocationWeather = () => {
    if (!navigator.geolocation || loading) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        setWeather(data);
        setPosition([latitude, longitude]);
      } catch {
        setError("Location weather fetch failed");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather(city);
  };

  const getRecommendation = (temp) => {
    if (!temp) return "";
    if (temp < 15) return "🧥 Wear warm clothes";
    if (temp < 25) return "👕 Light clothes are good";
    return "🕶 Stay hydrated & cool";
  };

  return (
    <div className="max-w-screen p-4 bg-white rounded-2xl shadow-xl max-w-md mx-auto space-y-4">

      <h2 className="text-2xl font-bold text-center">
        🌦 Weather Assistant
      </h2>

      <div className="flex gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city..."
          className="border p-3 rounded-xl flex-1"
        />

        <button
          onClick={() => fetchWeather(city)}
          className="bg-green-600 text-white px-4 rounded-xl"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <button
        onClick={detectLocationWeather}
        className="w-full bg-blue-600 text-white py-2 rounded-xl"
      >
        📍 Detect Location
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {weather && (
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-green-600">
            {Math.round(weather?.main?.temp)}°C
          </h1>

          <p className="capitalize text-gray-600">
            {weather?.weather?.[0]?.description}
          </p>

          <div className="text-sm text-gray-500">
            Humidity: {weather?.main?.humidity}% |
            Wind: {weather?.wind?.speed} m/s
          </div>

          <div className="bg-green-50 p-3 rounded-xl font-medium">
            {getRecommendation(weather?.main?.temp)}
          </div>
        </div>
      )}

      {position && markerIcon && (
        <div className="h-64 w-full rounded-xl overflow-hidden">
          <MapContainer
            center={position}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={markerIcon}>
              <Popup>📍 Selected Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

    </div>
  );
}