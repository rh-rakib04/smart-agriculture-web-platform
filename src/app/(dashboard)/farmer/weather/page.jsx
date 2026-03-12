"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  MapPin,
  Search,
  RefreshCw,
  Leaf,
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  Zap,
  AlertTriangle,
  TrendingUp,
  Sprout,
  Calendar,
} from "lucide-react";

/* ── Brand tokens ──────────────────────────────────────────────────── */
const B = {
  primary: "#2E7D32",
  primaryLight: "#66BB6A",
  highlight: "#FBC02D",
  accent: "#8D6E63",
  muted: "#E8F5E9",
  border: "#C8E6C9",
  foreground: "#1B5E20",
  mutedFg: "#424242",
  card: "#ffffff",
};

/* ── Weather icon picker ────────────────────────────────────────────── */
function WeatherIcon({ code, size = 32 }) {
  const id = Math.floor(code / 100);
  const props = { size, strokeWidth: 1.8 };
  if (code >= 200 && code < 300)
    return <Zap {...props} style={{ color: B.highlight }} />;
  if (code >= 300 && code < 400)
    return <CloudRain {...props} style={{ color: "#64B5F6" }} />;
  if (code >= 500 && code < 600)
    return <CloudRain {...props} style={{ color: "#1E88E5" }} />;
  if (code >= 600 && code < 700)
    return <CloudSnow {...props} style={{ color: "#90CAF9" }} />;
  if (code >= 700 && code < 800)
    return <Cloud {...props} style={{ color: "#B0BEC5" }} />;
  if (code === 800) return <Sun {...props} style={{ color: B.highlight }} />;
  if (code >= 801 && code < 804)
    return <CloudSun {...props} style={{ color: "#FDD835" }} />;
  return <Cloud {...props} style={{ color: "#90A4AE" }} />;
}

/* ── Farming advice based on weather ───────────────────────────────── */
function getFarmAdvice(weather) {
  if (!weather) return [];
  const temp = weather.main?.temp;
  const humid = weather.main?.humidity;
  const code = weather.weather?.[0]?.id;
  const wind = weather.wind?.speed;
  const advice = [];

  if (code >= 500 && code < 600) {
    advice.push({
      icon: "🌧️",
      color: "#1E88E5",
      bg: "#E3F2FD",
      border: "#BBDEFB",
      title: "Rain expected — delay irrigation",
      body: "Skip irrigation today. Collect rainwater if possible. Check for waterlogging in low-lying fields.",
    });
  }
  if (code >= 200 && code < 300) {
    advice.push({
      icon: "⚡",
      color: "#E65100",
      bg: "#FBE9E7",
      border: "#FFCCBC",
      title: "Thunderstorm alert — stay safe",
      body: "Avoid open fields during lightning. Secure farm equipment. Postpone any spraying activities.",
    });
  }
  if (temp > 38) {
    advice.push({
      icon: "🔥",
      color: "#C62828",
      bg: "#FFEBEE",
      border: "#FFCDD2",
      title: "Extreme heat — protect crops",
      body: "Water crops early morning or evening. Mulch around plants to retain moisture. Young seedlings need shade.",
    });
  }
  if (temp < 10) {
    advice.push({
      icon: "❄️",
      color: "#1565C0",
      bg: "#E3F2FD",
      border: "#BBDEFB",
      title: "Cold wave — protect sensitive crops",
      body: "Cover seedlings overnight. Delay transplanting. Boro rice is at risk below 10°C.",
    });
  }
  if (humid > 85 && temp > 25) {
    advice.push({
      icon: "🍄",
      color: "#6A1B9A",
      bg: "#F3E5F5",
      border: "#E1BEE7",
      title: "High humidity — fungal risk",
      body: "Inspect crops for early blight, leaf rust. Apply preventive fungicide. Ensure good field drainage.",
    });
  }
  if (wind > 10) {
    advice.push({
      icon: "💨",
      color: B.accent,
      bg: "#EFEBE9",
      border: "#D7CCC8",
      title: "Strong winds — check stakes",
      body: "Support tall crops like corn and jute. Avoid spraying pesticides in strong winds. Harvest mature crops soon.",
    });
  }
  if (code === 800 && temp >= 20 && temp <= 32) {
    advice.push({
      icon: "✅",
      color: B.primary,
      bg: B.muted,
      border: B.border,
      title: "Great day for fieldwork!",
      body: "Ideal conditions for planting, spraying, and harvesting. Low disease pressure. Good day for soil preparation.",
    });
  }
  if (advice.length === 0) {
    advice.push({
      icon: "🌤️",
      color: B.primary,
      bg: B.muted,
      border: B.border,
      title: "Conditions look okay",
      body: "No immediate concerns. Monitor for changes. Good day for routine farm tasks.",
    });
  }
  return advice;
}

/* ── Stat card ─────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = B.primary,
  bg = B.muted,
  border = B.border,
}) {
  return (
    <div
      style={{
        padding: "16px 14px",
        borderRadius: 16,
        background: bg,
        border: `1.5px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            padding: "6px 7px",
            borderRadius: 9,
            background: B.card,
            border: `1.5px solid ${border}`,
          }}
        >
          <Icon size={14} style={{ color, display: "block" }} />
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            opacity: 0.8,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22,
          fontWeight: 900,
          color,
          lineHeight: 1,
        }}
      >
        {value}
        <span
          style={{ fontSize: 12, fontWeight: 700, marginLeft: 3, opacity: 0.7 }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ── Forecast card ─────────────────────────────────────────────────── */
function ForecastCard({ day, icon, high, low, desc }) {
  return (
    <div
      style={{
        padding: "14px 12px",
        borderRadius: 14,
        background: B.muted,
        border: `1.5px solid ${B.border}`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: B.mutedFg }}>
        {day}
      </div>
      {icon}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: B.mutedFg,
          lineHeight: 1.3,
          maxWidth: 70,
        }}
      >
        {desc}
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
          fontWeight: 900,
          color: B.foreground,
        }}
      >
        {high}° /{" "}
        <span style={{ color: B.mutedFg, fontWeight: 700 }}>{low}°</span>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function WeatherPage() {
  const [city, setCity] = useState("Dhaka");
  const [input, setInput] = useState("Dhaka");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Fetch weather ── */
  const fetchWeather = useCallback(async (targetCity) => {
    if (!targetCity.trim()) return;
    setLoading(true);
    setError("");

    /* 
      SETUP: Replace with your OpenWeatherMap API key
      Get a free key at https://openweathermap.org/api
      or use environment variable: process.env.NEXT_PUBLIC_WEATHER_API_KEY
    */
    const API_KEY =
      process.env.NEXT_PUBLIC_WEATHER_API_KEY || "YOUR_API_KEY_HERE";

    /* If no API key, show demo data */
    if (API_KEY === "YOUR_API_KEY_HERE") {
      await new Promise((r) => setTimeout(r, 800)); // simulate loading
      setWeather({
        name: targetCity,
        sys: { country: "BD" },
        main: {
          temp: 29,
          feels_like: 33,
          humidity: 72,
          temp_min: 26,
          temp_max: 32,
        },
        weather: [{ id: 801, main: "Clouds", description: "few clouds" }],
        wind: { speed: 4.2 },
        visibility: 8000,
        dt: Date.now() / 1000,
      });
      setForecast([
        {
          dt: Date.now() / 1000 + 86400,
          main: { temp: 31 },
          temp_min: 25,
          temp_max: 32,
          weather: [{ id: 800, description: "clear sky" }],
        },
        {
          dt: Date.now() / 1000 + 86400 * 2,
          main: { temp: 28 },
          temp_min: 23,
          temp_max: 30,
          weather: [{ id: 500, description: "light rain" }],
        },
        {
          dt: Date.now() / 1000 + 86400 * 3,
          main: { temp: 26 },
          temp_min: 22,
          temp_max: 28,
          weather: [{ id: 502, description: "heavy rain" }],
        },
        {
          dt: Date.now() / 1000 + 86400 * 4,
          main: { temp: 30 },
          temp_min: 25,
          temp_max: 31,
          weather: [{ id: 801, description: "few clouds" }],
        },
        {
          dt: Date.now() / 1000 + 86400 * 5,
          main: { temp: 32 },
          temp_min: 27,
          temp_max: 33,
          weather: [{ id: 800, description: "sunny" }],
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const [wRes, fRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetCity)}&appid=${API_KEY}&units=metric`,
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(targetCity)}&appid=${API_KEY}&units=metric&cnt=40`,
        ),
      ]);

      if (!wRes.ok)
        throw new Error(
          wRes.status === 404
            ? `City "${targetCity}" not found.`
            : "Weather service unavailable.",
        );

      const wData = await wRes.json();
      const fData = await fRes.json();

      setWeather(wData);

      /* One forecast per day (noon slot) */
      const seen = new Set();
      const daily = (fData.list || [])
        .filter((item) => {
          const d = new Date(item.dt * 1000).toDateString();
          if (seen.has(d)) return false;
          seen.add(d);
          return true;
        })
        .slice(1, 6);

      setForecast(daily);
    } catch (e) {
      setError(e.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather("Dhaka");
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (input.trim()) {
      setCity(input.trim());
      fetchWeather(input.trim());
    }
  };

  const advice = getFarmAdvice(weather);
  const temp = weather ? Math.round(weather.main.temp) : "--";
  const feelsLike = weather ? Math.round(weather.main.feels_like) : "--";
  const humidity = weather?.main?.humidity ?? "--";
  const windSpeed = weather?.wind?.speed ?? "--";
  const visibility = weather ? (weather.visibility / 1000).toFixed(1) : "--";
  const desc = weather?.weather?.[0]?.description ?? "";
  const code = weather?.weather?.[0]?.id ?? 800;

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        @keyframes spin    { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes pulse   { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        .wx-search:focus-within { border-color: ${B.primary} !important; box-shadow: 0 0 0 3px rgba(46,125,50,0.12); }
        .wx-refresh:hover { background: ${B.muted} !important; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 14px",
            borderRadius: 20,
            background: B.muted,
            border: `1.5px solid ${B.border}`,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: B.primaryLight,
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: B.primary,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            Farmer · Weather
          </span>
        </div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: B.foreground,
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: 1.15,
          }}
        >
          Farm{" "}
          <span
            style={{
              color: B.primary,
              position: "relative",
              display: "inline-block",
            }}
          >
            Weather
            <span
              style={{
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${B.highlight}, transparent)`,
              }}
            />
          </span>
        </h1>
        <p
          style={{ fontSize: 14, color: B.mutedFg, fontWeight: 500, margin: 0 }}
        >
          Real-time weather with smart farming advice for your region.
        </p>
      </div>

      {/* ── Search bar ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 24,
          animation: "fadeUp 0.4s 0.05s ease both",
        }}
      >
        <div
          className="wx-search"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 14px",
            borderRadius: 13,
            background: B.card,
            border: `1.5px solid ${B.border}`,
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        >
          <MapPin size={15} style={{ color: B.primary, flexShrink: 0 }} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter city name (e.g. Rajshahi, Sylhet, Comilla...)"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              fontWeight: 600,
              color: B.foreground,
              background: "transparent",
              height: 46,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0 22px",
            borderRadius: 13,
            background: `linear-gradient(135deg, ${B.primary}, ${B.foreground})`,
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 46,
            opacity: loading ? 0.7 : 1,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Search size={15} />
          Search
        </button>
        <button
          type="button"
          className="wx-refresh"
          onClick={() => fetchWeather(city)}
          disabled={loading}
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "transparent",
            border: `1.5px solid ${B.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: B.primary,
            transition: "background 0.15s",
          }}
        >
          <RefreshCw
            size={15}
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          />
        </button>
      </form>

      {/* ── Error ────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 13,
            background: "#FFEBEE",
            border: "1.5px solid #FFCDD2",
            color: "#C62828",
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────── */}
      {loading && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: 20,
                background: B.muted,
                border: `1.5px solid ${B.border}`,
                height: 180,
                animation: "pulse 1.5s infinite",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Weather content ──────────────────────────────────────── */}
      {!loading && weather && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Current weather card */}
          <div
            style={{
              borderRadius: 22,
              background: `linear-gradient(135deg, ${B.primary} 0%, ${B.foreground} 100%)`,
              padding: "28px 28px",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 8px 32px rgba(46,125,50,0.3)`,
              animation: "fadeUp 0.4s ease both",
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                right: -40,
                top: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 40,
                bottom: -60,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <MapPin
                    size={14}
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {weather.name}, {weather.sys?.country}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {temp}°
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {desc}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    marginTop: 4,
                  }}
                >
                  Feels like {feelsLike}° · H:
                  {weather.main.temp_max
                    ? Math.round(weather.main.temp_max)
                    : "--"}
                  ° L:
                  {weather.main.temp_min
                    ? Math.round(weather.main.temp_min)
                    : "--"}
                  °
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <WeatherIcon code={code} size={72} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {weather.weather[0].main}
                </span>
              </div>
            </div>

            {/* Mini stats strip */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 20,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.15)",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: Droplets, label: "Humidity", value: `${humidity}%` },
                { icon: Wind, label: "Wind", value: `${windSpeed} m/s` },
                { icon: Eye, label: "Visibility", value: `${visibility} km` },
                {
                  icon: Thermometer,
                  label: "Feels Like",
                  value: `${feelsLike}°C`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <s.icon
                    size={14}
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}
                    >
                      {s.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              animation: "fadeUp 0.4s 0.08s ease both",
            }}
          >
            <StatCard
              icon={Droplets}
              label="Humidity"
              value={humidity}
              unit="%"
              color="#1565C0"
              bg="#E3F2FD"
              border="#BBDEFB"
            />
            <StatCard
              icon={Wind}
              label="Wind"
              value={windSpeed}
              unit="m/s"
              color={B.accent}
              bg="#EFEBE9"
              border="#D7CCC8"
            />
            <StatCard
              icon={Eye}
              label="Visibility"
              value={visibility}
              unit="km"
              color="#6A1B9A"
              bg="#F3E5F5"
              border="#E1BEE7"
            />
            <StatCard
              icon={Thermometer}
              label="Feels Like"
              value={`${feelsLike}`}
              unit="°C"
              color={B.primary}
            />
          </div>

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <div
              style={{
                background: B.card,
                borderRadius: 20,
                border: `1.5px solid ${B.border}`,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(46,125,50,0.07)",
                animation: "fadeUp 0.4s 0.12s ease both",
              }}
            >
              <div
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${B.highlight}, transparent)`,
                }}
              />
              <div style={{ padding: "18px 22px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      padding: "7px 8px",
                      borderRadius: 10,
                      background: B.muted,
                      border: `1.5px solid ${B.border}`,
                    }}
                  >
                    <Calendar size={15} style={{ color: B.primary }} />
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: B.foreground,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    5-Day Forecast
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 10,
                  }}
                >
                  {forecast.map((f, i) => {
                    const d = new Date(f.dt * 1000);
                    const dayName = i === 0 ? "Tomorrow" : DAYS[d.getDay()];
                    const fcode = f.weather?.[0]?.id || 800;
                    const fdesc = f.weather?.[0]?.description || "";
                    const fhigh = Math.round(
                      f.main?.temp_max ?? f.main?.temp ?? 0,
                    );
                    const flow = Math.round(
                      f.main?.temp_min ?? f.main?.temp ?? 0,
                    );
                    return (
                      <ForecastCard
                        key={i}
                        day={dayName}
                        icon={<WeatherIcon code={fcode} size={24} />}
                        high={fhigh}
                        low={flow}
                        desc={fdesc}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Farm advice */}
          <div
            style={{
              background: B.card,
              borderRadius: 20,
              border: `1.5px solid ${B.border}`,
              overflow: "hidden",
              boxShadow: "0 2px 16px rgba(46,125,50,0.07)",
              animation: "fadeUp 0.4s 0.16s ease both",
            }}
          >
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${B.primary}, transparent)`,
              }}
            />
            <div style={{ padding: "18px 22px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    padding: "7px 8px",
                    borderRadius: 10,
                    background: B.muted,
                    border: `1.5px solid ${B.border}`,
                  }}
                >
                  <Sprout size={15} style={{ color: B.primary }} />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 900,
                    color: B.foreground,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Smart Farming Advice
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {advice.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: a.bg,
                      border: `1.5px solid ${a.border}`,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}
                    >
                      {a.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: a.color,
                          marginBottom: 3,
                        }}
                      >
                        {a.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: B.mutedFg,
                          lineHeight: 1.6,
                        }}
                      >
                        {a.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demo notice */}
          {!process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#FFF8E1",
                border: "1.5px solid #FFE082",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <AlertTriangle
                size={14}
                style={{ color: "#F9A825", flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "#E65100", fontWeight: 600 }}>
                Demo mode — add{" "}
                <code
                  style={{
                    background: "#FFF3E0",
                    padding: "1px 5px",
                    borderRadius: 4,
                  }}
                >
                  NEXT_PUBLIC_WEATHER_API_KEY
                </code>{" "}
                to your{" "}
                <code
                  style={{
                    background: "#FFF3E0",
                    padding: "1px 5px",
                    borderRadius: 4,
                  }}
                >
                  .env.local
                </code>{" "}
                for live weather data.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
