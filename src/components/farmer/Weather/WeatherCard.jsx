"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

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
  const [position, setPosition] = useState([23.8103, 90.4125]);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "073a8bfbae4831acfd5d0662d23829a4";

  // Load Leaflet icon
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

  // Weather fetch
  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName},BD&units=metric&appid=${API_KEY}`
      );

      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);

      setWeather(data);
      setPosition([data.coord.lat, data.coord.lon]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Detect Location Weather */
  const detectLocationWeather = () => {
    if (!navigator.geolocation || loading) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        setPosition([latitude, longitude]);

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);

        setWeather(data);

      } catch (err) {
        setError(err.message || "Location detection failed");
      } finally {
        setLoading(false);
      }
    });
  };

  const getRecommendation = (temp) => {
    if (!temp) return "";

    if (temp < 15) return "🧥 Cold weather — wear warm clothes";
    if (temp < 25) return "👕 Comfortable weather";
    return "🕶 Hot weather — stay hydrated";
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col p-6 ">

      <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary">
              🌦 Weather Assistant
          </h2>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 bg-card p-4 rounded-2xl shadow-md border border-border">

  {/* Input */}
  <div className="relative flex-1">

    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      🔍
    </span>

    <input
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
      placeholder="Search city weather..."
      className="w-full pl-10 pr-4 py-3 rounded-xl 
      border border-border 
      bg-background 
      focus:outline-none 
      focus:ring-2 focus:ring-primary 
      transition"
    />
  </div>

  {/* Search Button */}
  <button
    onClick={() => fetchWeather(city)}
    className="px-6 py-3 
    bg-primary 
    text-white 
    rounded-xl 
    font-semibold
    hover:bg-primary/90 
    transition 
    shadow-md"
  >
    {loading ? "⏳ Searching..." : "🌦 Search Weather"}
  </button>

</div>

      <button
        onClick={detectLocationWeather}
        className="w-full bg-green-700  text-white py-2 rounded-xl hover:bg-secondary transition"
      >
        📍 Detect Your Location
      </button>

      {error && (
        <p className="text-red-500 text-center font-medium">{error}</p>
      )}

      {/* Weather Info */}
      {weather && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

    {/* Temperature Card */}
    <div className="p-4 bg-green-50 rounded-2xl shadow text-center">
      <p className="text-sm text-gray-500">🌡 Temperature</p>
      <h2 className="text-2xl font-bold text-green-600">
        {Math.round(weather?.main?.temp)}°C
      </h2>
    </div>

    {/* Humidity Card */}
    <div className="p-4 bg-blue-50 rounded-2xl shadow text-center">
      <p className="text-sm text-gray-500">💧 Humidity</p>
      <h2 className="text-2xl font-bold text-blue-600">
        {weather?.main?.humidity
  ? `${weather.main.humidity}%`
  : "--%"}
      </h2>
    </div>

    {/* Wind Speed Card */}
    <div className="p-4 bg-yellow-50 rounded-2xl shadow text-center">
      <p className="text-sm text-gray-500">🌬 Wind Speed</p>
      <h2 className="text-2xl font-bold text-yellow-600">
        {weather?.wind?.speed} m/s
      </h2>
    </div>

    {/* Pressure Card */}
    <div className="p-4 bg-purple-50 rounded-2xl shadow text-center">
      <p className="text-sm text-gray-500">⚡ Pressure</p>
      <h2 className="text-2xl font-bold text-purple-600">
        {weather?.main?.pressure} hPa
      </h2>
    </div>

  </div>
)}

      {/* Map 
      {position && markerIcon && (
        <div className="p-4 h-64 rounded-xl overflow-hidden">
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
    */}

    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mt-6">
  <MapContainer
    center={position}
    zoom={13}
    className="h-full w-full"
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {markerIcon && (
      <Marker position={position} icon={markerIcon}>
        <Popup>📍 Current Location</Popup>
      </Marker>
    )}

  </MapContainer>
</div>

    </div>
  );
}