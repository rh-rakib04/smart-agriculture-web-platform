"use client";

/**
 * FarmerFeatures
 *
 * Design:
 * - farmer-feature.jpg (rice paddy, lush green, portrait farmer) used as
 *   full section background — right-anchored so the farmer is visible.
 * - Heavy left-side dark overlay so white text reads cleanly.
 * - Features displayed as a vertical numbered track with connecting line
 *   and icon pills — feels editorial and premium vs generic cards.
 * - Highlight accent on active/hovered feature number.
 * - Section has diagonal bottom clip to flow into BuyerFeatures.
 */
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Wheat,
  TrendingUp,
  Brain,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    num: "01",
    icon: Wheat,
    title: "farmer.feature1Title",
    desc: "farmer.feature1Desc",
  },
  {
    num: "02",
    icon: TrendingUp,
    title: "farmer.feature2Title",
    desc: "farmer.feature2Desc",
  },
  {
    num: "03",
    icon: Brain,
    title: "farmer.feature3Title",
    desc: "farmer.feature3Desc",
  },
  {
    num: "04",
    icon: CalendarDays,
    title: "farmer.feature4Title",
    desc: "farmer.feature4Desc",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FarmerFeatures() {
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();
  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        paddingBottom: "4rem",
      }}
    >
      {/* ── Full-bleed background image ── */}
      <Image
        src="/images/farmer-feature.jpg"
        alt="Farmer planting rice"
        fill
        className="object-cover object-right"
        sizes="100vw"
        quality={90}
      />

      {/* ── Overlays ── */}
      {/* Strong left fade so content is legible */}
      <div
        className="absolute inset-0 bg-gradient-to-r
        from-black/92 via-black/75 to-black/30"
      />
      {/* Top & bottom vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b
        from-black/40 via-transparent to-black/50"
      />
      {/* Deep green tint to tie into brand */}
      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-highlight/20 border border-highlight/30
              text-highlight text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Wheat size={13} />
            {t("farmer.label")}
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl lg:text-5xl xl:text-6xl font-extrabold
              text-white leading-tight tracking-tight mb-5"
          >
          {t("farmer.title1")}
            <br />
            <span className="text-highlight">{t("farmer.title2")}</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-white/60 text-lg leading-relaxed mb-14"
          >
        {t("farmer.subtitle")}
          </motion.p>

          {/* ── Numbered feature track ── */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-px bg-white/10" />

            <div className="space-y-2">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                const isActive = activeIdx === i;

                return (
                  <motion.div
                    key={f.num}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`relative flex gap-5 p-5 rounded-2xl cursor-default
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-white/10 backdrop-blur-sm border border-white/15"
                          : "hover:bg-white/5"
                      }`}
                  >
                    {/* Number node on the line */}
                    <div
                      className={`relative z-10 w-11 h-11 rounded-full flex items-center
                      justify-center shrink-0 font-extrabold text-sm
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-highlight text-gray-900 shadow-lg shadow-highlight/30"
                          : "bg-white/10 text-white/50 border border-white/10"
                      }`}
                    >
                      {f.num}
                    </div>

                    {/* Text */}
                    <div className="pt-1.5">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon
                          size={15}
                          className={`transition-colors duration-300
                            ${isActive ? "text-highlight" : "text-white/40"}`}
                        />
                        <h4
                          className={`font-bold text-base transition-colors duration-300
                          ${isActive ? "text-white" : "text-white/70"}`}
                        >
                          {t(f.title)}
                        </h4>
                      </div>
                      <p
                        className={`text-sm leading-relaxed transition-colors duration-300
                        ${isActive ? "text-white/70" : "text-white/35"}`}
                      >
                        {t(f.desc)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
