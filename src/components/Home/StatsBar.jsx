"use client";

/**
 * StatsBar
 * Sits directly below the HeroSection.
 *
 * Design rationale:
 * - hero-bg.jpg is a warm golden wheat sunset → this section uses a deep
 *   warm olive/earth tone to transition naturally from the hero's dark overlay
 *   into the lighter page sections below.
 * - Diagonal top clip visually "continues" the hero into this section.
 * - Highlight (golden yellow) accents echo the sunset warmth.
 * - Large numbers are the hero of each card — minimal decoration.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sprout, ShoppingBasket, Brain, MapPin } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    icon: Sprout,
    value: 12400,
    suffix: "+",
    label: "Farmers Joined",
    desc: "Across Bangladesh",
    accent: "text-secondary",        // soft green
    iconBg: "bg-secondary/20",
  },
  {
    icon: ShoppingBasket,
    value: 3800,
    suffix: "+",
    label: "Buyers Connected",
    desc: "Direct, no middlemen",
    accent: "text-highlight",        // golden yellow — echoes hero sunset
    iconBg: "bg-highlight/20",
  },
  {
    icon: Brain,
    value: 98000,
    suffix: "+",
    label: "AI Queries Answered",
    desc: "Smart recommendations",
    accent: "text-secondary",
    iconBg: "bg-secondary/20",
  },
  {
    icon: MapPin,
    value: 64,
    suffix: "",
    label: "Districts Covered",
    desc: "Nationwide reach",
    accent: "text-highlight",
    iconBg: "bg-highlight/20",
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix, accent }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const totalSteps = 60;
    const step = value / totalSteps;
    const interval = 1800 / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className={`font-extrabold tracking-tight ${accent}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="relative bg-foreground overflow-hidden "
      style={{
        // Diagonal clip — top edge angles downward to "catch" the hero
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        paddingBottom: "5rem",
      }}
    >
      {/* ── Warm ambient glow echoing the golden hero ── */}
      <div className="absolute top-0 left-1/3 w-125 h-40
        bg-highlight/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-32
        bg-secondary/10 blur-3xl pointer-events-none" />

      {/* ── Subtle dot texture ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div
        ref={ref}
        className="relative max-w-330 mx-auto px-6 lg:px-10 pt-16 pb-8"
      >
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm font-semibold tracking-[0.2em] uppercase">
            Growing Together
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex flex-col items-center text-center
                  px-6 py-10 bg-white/3 hover:bg-white/[0.07]
                  transition-colors duration-300"
              >
                {/* Icon pill */}
                <div className={`w-11 h-11 rounded-2xl ${stat.iconBg}
                  flex items-center justify-center mb-5
                  group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={20} className={stat.accent} />
                </div>

                {/* Big counter */}
                <p className="text-4xl xl:text-5xl mb-2 leading-none">
                  {inView
                    ? <AnimatedCounter value={stat.value} suffix={stat.suffix} accent={stat.accent} />
                    : <span className={`font-extrabold tracking-tight ${stat.accent}`}>0</span>
                  }
                </p>

                {/* Label */}
                <p className="text-white text-sm font-bold mb-1">{stat.label}</p>

                {/* Description */}
                <p className="text-white/35 text-xs">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}