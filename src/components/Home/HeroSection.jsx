"use client";

/**
 * HeroSection — Multiple video crossfade hero
 *
 * VIDEO SETUP:
 *   /public/videos/hero-1.mp4   wheat field golden hour
 *   /public/videos/hero-2.mp4   rice paddy aerial view
 *   /public/videos/hero-3.mp4   farmer harvesting crops
 *
 * H.264 MP4, 1920×1080, 6–10s loop, <8MB each
 * Free: pexels.com/search/videos/farming
 *
 * ffmpeg compress:
 *   ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -an -t 8 public/videos/hero-1.mp4
 *
 * POSTER FALLBACK:
 *   /public/images/hero-bg.jpg
 *   /public/images/hero-bg-2.jpg
 *   /public/images/hero-bg-3.jpg
 */

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Sprout,
  Leaf,
  Sun,
  Droplets,
  Wheat,
  Tractor,
} from "lucide-react";

// ─── Playlist ─────────────────────────────────────────────────────────────────
const VIDEOS = [
  {
    src: "/videos/hero-1.mp4",
    poster: "/images/hero-bg.jpg",
    label: "Golden Harvest",
  },
  {
    src: "/videos/hero-2.mp4",
    poster: "/images/hero-bg-2.jpg",
    label: "Rice Paddies",
  },
  {
    src: "/videos/hero-3.mp4",
    poster: "/images/hero-bg-3.jpg",
    label: "Farmer's Journey",
  },
];

const SWITCH_MS = 7000;
const FADE_MS = 1200;

// ─── Floating badge ───────────────────────────────────────────────────────────
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
      initial={{ opacity: 0, scale: 0.82, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute backdrop-blur-md border border-white/20 rounded-2xl
                  px-4 py-3 flex items-center gap-3 shadow-2xl
                  hover:border-white/40 transition-colors duration-300 ${className}`}
      style={{ background: "rgba(20,50,10,0.55)", zIndex: 20 }}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p
          className="text-white font-bold text-sm leading-tight"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          {title}
        </p>
        <p className="text-white/55 text-xs leading-tight mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}

const BADGES = [
  {
    icon: Leaf,
    title: "100% Organic",
    subtitle: "Certified natural farming",
    delay: 1.1,
    iconBg: "bg-[#2d5a1b]",
    className: "top-[28%] right-16",
  },
  {
    icon: Sun,
    title: "Seasonal Harvest",
    subtitle: "Fresh crops year-round",
    delay: 1.35,
    iconBg: "bg-[#c8a227]",
    className: "top-[48%] right-32",
  },
  {
    icon: Droplets,
    title: "Smart Irrigation",
    subtitle: "Water-efficient methods",
    delay: 1.6,
    iconBg: "bg-[#185fa5]",
    className: "top-[66%] right-16",
  },
];

const BOTTOM_FEATURES = [
  { icon: Sprout, label: "Healthy Soil Solutions" },
  { icon: Wheat, label: "Pure Organic Growth" },
  { icon: Tractor, label: "Nature-Driven Innovation" },
];

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.5 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};
const slideRight = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

function GrainOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      style={{ zIndex: 3 }}
      aria-hidden="true"
    >
      <filter id="hg">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hg)" />
    </svg>
  );
}

// ─── Video element style — hides ALL browser native controls ──────────────────
const VIDEO_STYLE = {
  // pointer-events:none stops browser detecting hover → no native mute icon
  pointerEvents: "none",
  // WebKit: hide the media overlay controls
  WebkitMediaControls: "none",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  const refA = useRef(null);
  const refB = useRef(null);

  const [activeSlot, setActiveSlot] = useState("A");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Boot: load slot A, preload slot B
  useEffect(() => {
    if (prefersReduced) return;
    const va = refA.current;
    const vb = refB.current;
    if (!va) return;

    va.src = VIDEOS[0].src;
    va.poster = VIDEOS[0].poster;
    va.muted = true;
    va.load();
    va.play().catch(() => {});

    if (vb) {
      vb.src = VIDEOS[1].src;
      vb.poster = VIDEOS[1].poster;
      vb.muted = true;
      vb.load();
    }
  }, [prefersReduced]);

  // Crossfade to specific index
  const goTo = useCallback(
    (toIdx) => {
      if (transitioning) return;
      setTransitioning(true);

      const incoming = activeSlot === "A" ? refB.current : refA.current;
      const outgoing = activeSlot === "A" ? refA.current : refB.current;
      if (!incoming || !outgoing) {
        setTransitioning(false);
        return;
      }

      if (incoming.src !== window.location.origin + VIDEOS[toIdx].src) {
        incoming.src = VIDEOS[toIdx].src;
        incoming.poster = VIDEOS[toIdx].poster;
        incoming.muted = true;
        incoming.load();
      }
      incoming.play().catch(() => {});

      incoming.style.transition = `opacity ${FADE_MS}ms ease`;
      incoming.style.opacity = "1";
      incoming.style.zIndex = "2";

      outgoing.style.transition = `opacity ${FADE_MS}ms ease`;
      outgoing.style.opacity = "0";
      outgoing.style.zIndex = "1";

      setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;

        const preloadIdx = (toIdx + 1) % VIDEOS.length;
        outgoing.src = VIDEOS[preloadIdx].src;
        outgoing.poster = VIDEOS[preloadIdx].poster;
        outgoing.muted = true;
        outgoing.load();
        outgoing.style.transition = "none";
        outgoing.style.opacity = "0";
        outgoing.style.zIndex = "1";

        setActiveSlot((s) => (s === "A" ? "B" : "A"));
        setCurrentIdx(toIdx);
        setTransitioning(false);
      }, FADE_MS + 80);
    },
    [activeSlot, transitioning],
  );

  // Auto-advance
  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => {
      goTo((currentIdx + 1) % VIDEOS.length);
    }, SWITCH_MS);
    return () => clearInterval(t);
  }, [goTo, currentIdx, prefersReduced]);

  return (
    <section className="relative h-[88vh] min-h-screen w-full overflow-hidden">
      {/* ── VIDEO SLOTS — pointerEvents:none hides browser native controls ── */}
      <video
        ref={refA}
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ ...VIDEO_STYLE, zIndex: 2, opacity: 1 }}
      />
      <video
        ref={refB}
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ ...VIDEO_STYLE, zIndex: 1, opacity: 0 }}
      />

      {/* ── Grain ──────────────────────────────────────────────────────── */}
      <GrainOverlay />

      {/* ── Overlays ───────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 4 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,24,4,0.90) 0%, rgba(12,35,6,0.60) 44%, rgba(8,24,4,0.18) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,20,4,0.82) 0%, transparent 44%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 25%)",
          }}
        />
      </div>

      {/* ── Glow orbs ──────────────────────────────────────────────────── */}
      {!prefersReduced && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(74,124,47,0.30), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.06, 0.14, 0.06] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200,162,39,0.20), transparent 70%)",
              filter: "blur(32px)",
            }}
          />
        </div>
      )}

      {/* ── Vertical dot progress (right edge) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-24 right-6 flex flex-col gap-2 items-center"
        style={{ zIndex: 30 }}
      >
        {VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="flex items-center justify-center"
            title={VIDEOS[i].label}
          >
            <motion.span
              animate={{
                height: currentIdx === i ? 24 : 6,
                width: 6,
                background:
                  currentIdx === i ? "#c8a227" : "rgba(255,255,255,0.30)",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="block rounded-full"
            />
          </button>
        ))}
      </motion.div>

      {/* ── Slide counter (bottom-left) ─────────────────────────────────── */}
      <div
        className="absolute bottom-20 left-10 hidden md:block"
        style={{ zIndex: 30 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
            className="text-white/30 text-[10px] uppercase tracking-[0.22em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            {String(currentIdx + 1).padStart(2, "0")} /{" "}
            {String(VIDEOS.length).padStart(2, "0")} —{" "}
            {VIDEOS[currentIdx].label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Progress bar (very bottom) ──────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10"
        style={{ zIndex: 30 }}
      >
        <motion.div
          key={currentIdx}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: SWITCH_MS / 1000, ease: "linear" }}
          className="h-full bg-[#c8a227]"
        />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div
        className="relative h-full px-6 lg:px-14 flex flex-col justify-center"
        style={{ zIndex: 20 }}
      >
        <motion.div
          variants={containerV}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Tag pill */}
          <motion.div variants={slideRight} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border
                         text-[11px] font-bold tracking-widest uppercase backdrop-blur-sm"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                background: "rgba(200,162,39,0.18)",
                borderColor: "rgba(200,162,39,0.45)",
                color: "#f0c040",
              }}
            >
              <Sprout size={13} />
              Agriculture &amp; Organic Farms
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-[66px] font-extrabold text-white
                       leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Rooted in Nature,
            <br />
            <span style={{ color: "#f0c040" }}>Growing</span> the Future
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-[16px] text-white/65 leading-relaxed mb-8 max-w-md"
          >
            Empowering Bangladeshi farmers and buyers with AI-driven tools,
            direct market access, and real-time agricultural insights — no
            middlemen, no barriers.
          </motion.p>

          {/* Stats */}
          <motion.div variants={fadeUp} className="flex gap-8 mb-9">
            {[
              ["500+", "Farmers"],
              ["1.2K", "Crops Listed"],
              ["98%", "Satisfaction"],
            ].map(([n, l]) => (
              <div key={l}>
                <p
                  className="text-[22px] font-bold text-[#f0c040] leading-none"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  {n}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link
              href="/crops"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                         font-bold text-[13px] uppercase tracking-wide shadow-lg transition-all duration-300"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                background: "#c8a227",
                color: "#fff",
              }}
            >
              Explore Crops
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/smart-ai-chatbot"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                         font-bold text-[13px] uppercase tracking-wide border transition-all duration-300"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                borderColor: "rgba(255,255,255,0.25)",
                color: "#fff",
              }}
            >
              Try AI Assistant
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Floating badges (desktop) ──────────────────────────────────── */}
      <div className="hidden lg:block">
        {BADGES.map((b) => (
          <FloatingBadge key={b.title} {...b} />
        ))}
      </div>

      {/* ── Bottom feature strip ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.75 }}
        className="absolute bottom-0 left-0 right-0 border-t"
        style={{
          zIndex: 20,
          background: "rgba(8,24,4,0.70)",
          backdropFilter: "blur(14px)",
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-3 py-4">
            {BOTTOM_FEATURES.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2.5 px-4 py-1"
                style={{
                  borderRight:
                    i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <Icon size={18} className="text-[#c8a227]" />
                <span
                  className="text-white/65 text-[12px] font-semibold hidden sm:block"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
        className="absolute bottom-[72px] left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5"
        style={{ zIndex: 20 }}
      >
        <span className="text-white/25 text-[9px] tracking-[0.22em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
