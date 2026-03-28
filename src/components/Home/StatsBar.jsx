"use client";

/**
 * StatsBar
 * Abstract CSS gradient background — no image dependency.
 * Rich deep green mesh gradient with amber/gold light bleeds
 * that echo the hero's warm sunset tones without repeating the image.
 * Glass container floats over it with white divider lines.
 */
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sprout, ShoppingBasket, Brain, MapPin } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    icon: Sprout,
    value: 12400,
    suffix: "+",
    label: "stats.item1Label",
    desc: "stats.item1Desc",
    iconColor: "text-secondary",
  },
  {
    icon: ShoppingBasket,
    value: 3800,
    suffix: "+",
    label: "stats.item2Label",
    desc: "stats.item2Desc",
    iconColor: "text-highlight",
  },
  {
    icon: Brain,
    value: 98000,
    suffix: "+",
    label: "stats.item3Label",
    desc: "stats.item3Desc",
    iconColor: "text-secondary",
  },
  {
    icon: MapPin,
    value: 64,
    suffix: "",
    label: "stats.item4Label",
    desc: "stats.item4Desc",
    iconColor: "text-highlight",
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const totalSteps = 60;
    const stepVal = value / totalSteps;
    const interval = 1800 / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepVal;
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
    <span ref={ref} className={`font-extrabold tracking-tight ${color}`}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { t } = useTranslation();
  return (
    <section
      className="relative overflow-hidden"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        paddingBottom: "4rem",
        // Rich deep green mesh gradient — distinct from hero, no image needed
        background: `
          radial-gradient(ellipse at 0% 50%, #1B5E20 0%, transparent 60%),
          radial-gradient(ellipse at 100% 50%, #2E7D32 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, #FBC02D22 0%, transparent 50%),
          radial-gradient(ellipse at 30% 0%, #66BB6A18 0%, transparent 45%),
          linear-gradient(135deg, #0a2e0a 0%, #1a4a1a 50%, #0d3d0d 100%)
        `,
      }}
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Warm amber glow at bottom — echoes hero sunset */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2
        w-[500px] h-24 bg-highlight/10 blur-3xl pointer-events-none"
      />

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 pt-14 pb-8"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-white/30 text-xs font-bold
            tracking-[0.25em] uppercase mb-10"
        >
          t("stats.title")
        </motion.p>

        {/* Glass card container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4
            divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-white/10
            bg-white/[0.07] backdrop-blur-xl
            border border-white/15
            rounded-3xl overflow-hidden
            shadow-2xl shadow-black/40"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex flex-col items-center text-center
                  px-6 py-10 hover:bg-white/[0.06]
                  transition-colors duration-300"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl
                  bg-white/8 border border-white/10
                  flex items-center justify-center mb-5
                  group-hover:scale-110 group-hover:border-white/25
                  transition-all duration-300"
                >
                  <Icon size={22} className={stat.iconColor} />
                </div>

                {/* Counter */}
                <p className="text-4xl xl:text-5xl mb-2 leading-none">
                  {inView ? (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      color={stat.iconColor}
                    />
                  ) : (
                    <span
                      className={`font-extrabold tracking-tight ${stat.iconColor}`}
                    >
                      0
                    </span>
                  )}
                </p>

                {/* Label */}
                <p className="text-white font-bold text-sm mb-1">
                 {t(stat.label)}
                </p>

                {/* Desc */}
                <p className="text-white/35 text-xs">{t(stat.desc)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
