"use client";

/**
 * WeatherHighlight
 * weather-bg.jpg — dramatic storm clouds over wheat field
 * Full bleed dark dramatic section, animated weather widgets
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CloudSun, Wind, Droplets, Thermometer, ArrowUpRight, CloudRain, Sun, Cloud } from "lucide-react";

const WEATHER_CARDS = [
  { icon: Sun, label: "Today", temp: "32°C", desc: "Sunny", color: "text-highlight" },
  { icon: CloudRain, label: "Tomorrow", temp: "27°C", desc: "Rain", color: "text-sky-400" },
  { icon: Cloud, label: "Day 3", temp: "29°C", desc: "Cloudy", color: "text-white/50" },
];

const FEATURES = [
  { icon: Thermometer, label: "Real-time Temperature & Humidity" },
  { icon: Wind, label: "Wind Speed & Direction" },
  { icon: Droplets, label: "Rainfall Predictions & Alerts" },
  { icon: CloudSun, label: "10-Day Agricultural Forecast" },
];

export default function WeatherHighlight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-32">
      <Image
        src="/images/weather-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        aria-hidden
      />
      {/* Dark dramatic overlay — the storm image is already dark so this is light */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-sky-500/20 border border-sky-400/30
                text-sky-300 text-xs font-bold tracking-widest uppercase mb-6"
            >
              <CloudSun size={13} />
              Weather & Forecast
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold
                text-white leading-tight tracking-tight mb-5"
            >
              Farm Smarter
              <br />
              <span className="text-sky-300">Know the Weather</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-white/55 text-lg leading-relaxed mb-10"
            >
              Real-time 10-day forecasts tailored for your farm location.
              Get alerts before storms hit, plan irrigation around rainfall,
              and never lose a harvest to surprise weather again.
            </motion.p>

            <div className="space-y-4 mb-10">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-sky-300" />
                    </div>
                    <span className="text-white/70 text-sm font-medium">{f.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.6 }}
            >
              <Link
                href="/farmer/weather"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5
                  bg-sky-500 text-white rounded-full font-bold text-sm
                  hover:bg-sky-400 transition-all duration-300 shadow-lg shadow-sky-500/25"
              >
                Check Weather Now
                <ArrowUpRight size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Animated weather widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-black/50 backdrop-blur-xl border border-white/10
              rounded-3xl overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-1">
                      Your Location
                    </p>
                    <p className="text-white font-bold text-lg">Rajshahi, Bangladesh</p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <CloudSun size={36} className="text-highlight" />
                  </motion.div>
                </div>

                {/* Big temp */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.7, type: "spring", stiffness: 200 }}
                  className="mt-4"
                >
                  <span className="text-7xl font-extrabold text-white tracking-tighter">32°</span>
                  <span className="text-white/40 text-xl ml-1">C</span>
                  <p className="text-white/50 text-sm mt-1">Feels like 35° · Partly Cloudy</p>
                </motion.div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/8 px-2 py-4">
                {[
                  { icon: Droplets, label: "Humidity", value: "74%" },
                  { icon: Wind, label: "Wind", value: "12 km/h" },
                  { icon: CloudRain, label: "Rain", value: "20%" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex flex-col items-center py-2">
                      <Icon size={16} className="text-sky-300 mb-1" />
                      <p className="text-white font-bold text-sm">{stat.value}</p>
                      <p className="text-white/35 text-xs">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* 3-day forecast */}
              <div className="px-5 pb-5">
                <p className="text-white/30 text-xs font-bold tracking-widest uppercase mb-3">
                  3-Day Forecast
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {WEATHER_CARDS.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                        className="bg-white/5 rounded-2xl p-3 text-center
                          border border-white/8 hover:bg-white/10 transition-colors duration-200"
                      >
                        <p className="text-white/40 text-xs mb-2">{card.label}</p>
                        <Icon size={20} className={`${card.color} mx-auto mb-1`} />
                        <p className="text-white font-bold text-sm">{card.temp}</p>
                        <p className="text-white/35 text-xs">{card.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Farm alert */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mx-5 mb-5 px-4 py-3 bg-highlight/15 border border-highlight/30
                  rounded-2xl flex items-center gap-3"
              >
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-highlight font-bold text-xs">Farm Alert</p>
                  <p className="text-white/60 text-xs">Heavy rain expected Day 2 — delay irrigation</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}