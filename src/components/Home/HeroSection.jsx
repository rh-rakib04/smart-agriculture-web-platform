"use client";

/**
 * HeroSection
 * Full-bleed image hero with transparent navbar overlap.
 * Left-aligned content, staggered entrance animations,
 * atmospheric agricultural floating badges, scroll indicator.
 *
 * IMAGE NEEDED: /public/images/hero-bg.jpg
 * → Download from Unsplash: "wheat field golden hour" or "rice paddy aerial green"
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Sprout,
  Leaf,
  Sun,
  Droplets,
  Wind,
  Wheat,
  Tractor,
} from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

// ─── Floating agricultural badge ─────────────────────────────────────────────

function FloatingBadge({
  icon: Icon,
  title,
  subtitle,
  delay,
  className,
  iconBg,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute bg-white/10 backdrop-blur-md border border-white/20
        rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl
        hover:bg-white/15 transition-colors duration-300 ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-tight">{title}</p>
        <p className="text-white/55 text-xs leading-tight mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}

const bottomFeatures = [
  { icon: Sprout, label: "Healthy Soil Solutions" },
  { icon: Wheat, label: "Pure Organic Growth" },
  { icon: Tractor, label: "Nature-Driven Innovation" },
];
// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[680px] w-full overflow-hidden ">
      {/* ── Background Image ── */}
      <Image
        src="/images/hero-bg.jpg"
        alt="SmartAgri — Agriculture & Organic Farming"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
quality={90}
      />

      {/* ── Layered overlays ── */}
      {/* Left-heavy so text is always legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      {/* Top fade for transparent navbar */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

      {/* ── Ambient glow orbs ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full
          bg-primary/25 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full
          bg-highlight/15 blur-3xl pointer-events-none"
      />

      {/* ── Main Content ── */}
      <div
        className="relative z-10 h-full  mx-auto px-6 lg:px-10
        flex flex-col justify-center mt-10"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Tag pill */}
          <motion.div variants={slideRight} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-2
              bg-highlight/20 border border-highlight/40 rounded-full
              text-highlight text-sm font-bold tracking-widest uppercase
              backdrop-blur-sm"
            >
              <Sprout size={14} />
              Agriculture &amp; Organic Farms
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold
              text-white leading-[1.05] tracking-tight mb-6"
          >
            Rooted in Nature,
            <br />
            <span className="text-highlight">Growing</span> the Future
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-lg text-white/70 leading-relaxed mb-10 max-w-md"
          >
            Empowering Bangladeshi farmers and buyers with AI-driven tools,
            direct market access, and real-time agricultural insights — no
            middlemen, no barriers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link
              href="/farmer"
              className="group inline-flex items-center gap-2.5 px-7 py-4
                bg-highlight text-gray-900 rounded-full font-bold text-base
                hover:brightness-110 transition-all duration-300
                shadow-lg shadow-highlight/25"
            >
              Explore More
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/smart-ai-chatbot"
              className="group inline-flex items-center gap-2.5 px-7 py-4
                bg-white/10 backdrop-blur-sm border border-white/25
                text-white rounded-full font-bold text-base
                hover:bg-white/20 transition-all duration-300"
            >
              Try AI Assistant
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Floating agricultural badges (desktop only) ── */}
      <div className="hidden lg:block">
        <FloatingBadge
          icon={Leaf}
          title="100% Organic"
          subtitle="Certified natural farming"
          delay={1.0}
          iconBg="bg-primary/70"
          className="top-[32%] right-20"
        />
        <FloatingBadge
          icon={Sun}
          title="Seasonal Harvest"
          subtitle="Fresh crops year-round"
          delay={1.25}
          iconBg="bg-highlight/70"
          className="top-[50%] right-36"
        />
        <FloatingBadge
          icon={Droplets}
          title="Smart Irrigation"
          subtitle="Water-efficient methods"
          delay={1.5}
          iconBg="bg-sky-500/70"
          className="top-[66%] right-20"
        />
      </div>

      {/* ── Bottom strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-10
          bg-black/30 backdrop-blur-md border-t border-white/10"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 divide-x divide-white/10 py-4">
            {bottomFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2.5 px-4 py-1"
                >
                  <Icon size={22} className="text-white/80" />
                  <span className="text-white/75 text-sm font-semibold hidden sm:block">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10
          hidden md:flex flex-col items-center gap-1"
      >
        <span className="text-white/35 text-xs tracking-[0.2em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-white/35" />
        </motion.div>
      </motion.div>
    </section>
  );
}
