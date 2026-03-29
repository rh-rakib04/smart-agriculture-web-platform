"use client";

/**
 * AIChatbotHighlight
 *
 * Design:
 * - ai-bg.jpg (dark green tech hexagons, glowing nodes) — full bleed
 *   background. The tech pattern sits on the RIGHT naturally, so content
 *   goes LEFT — the image composition does the work.
 * - Simulated chat bubbles animate in to show the AI in action.
 * - Glowing green pulse on the AI avatar echoes the hex glow in the image.
 * - Feature pills below the chat preview.
 * - Overall feel: premium, dark, futuristic — contrasts the earthy sections.
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  ArrowUpRight,
  Mic,
  Leaf,
  CloudSun,
  Bug,
  TrendingUp,
} from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// ─── Chat bubble data ─────────────────────────────────────────────────────────

const CHAT = [
  {
    role: "user",
    text: "ai.chat1",
    delay: 0.6,
  },
  {
    role: "ai",
    text: "ai.chat2",
    delay: 1.1,
  },
  {
    role: "user",
    text: "ai.chat3",
    delay: 1.7,
  },
  {
    role: "ai",
    text: "ai.chat4",
    delay: 2.2,
  },
];

const CAPABILITIES = [
  { icon: Leaf, label: "ai.cap1" },
  { icon: CloudSun, label: "ai.cap2" },
  { icon: Bug, label: "ai.cap3" },
  { icon: TrendingUp, label: "ai.cap4" },
];

// ─── Chat Bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ role, text, delay, inView }) {
  const isAI = role === "ai";
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-full bg-secondary/30 border border-secondary/40
          flex items-center justify-center shrink-0 mt-1"
        >
          <FaRobot size={13} className="text-secondary" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${
          isAI
            ? "bg-white/10 text-white/90 rounded-tl-sm border border-white/10"
            : "bg-highlight/90 text-gray-900 font-medium rounded-tr-sm"
        }`}
      >
      {t(text)}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChatbotHighlight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();
  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-32">
      {/* ── Background image ── */}
      <Image
        src="/images/ai-bg.jpg"
        alt=""
        fill
        className="object-cover object-right-bottom"
        sizes="100vw"
        quality={90}
        aria-hidden
      />

      {/* ── Overlays ── */}
      {/* Left-heavy so content reads over the dark left portion of the image */}
      <div
        className="absolute inset-0 bg-gradient-to-r
        from-black/90 via-black/70 to-black/40"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b
        from-black/50 via-transparent to-black/50"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── LEFT: Copy ── */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-secondary/20 border border-secondary/30
                text-secondary text-xs font-bold tracking-widest uppercase mb-6"
            >
              <Brain size={13} />
              {t("ai.label")}
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl lg:text-5xl xl:text-6xl font-extrabold
                text-white leading-tight tracking-tight mb-5"
            >
              {t("ai.title1")}
              <br />
              <span className="text-secondary">{t("ai.title2")}</span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-white/55 text-lg leading-relaxed mb-10"
            >
              {t("ai.subtitle")}
            </motion.p>

            {/* Capability pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-wrap gap-2.5 mb-10"
            >
              {CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={cap.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-2
                      bg-white/8 border border-white/12 rounded-full
                      text-white/70 text-sm font-medium
                      hover:bg-white/15 hover:text-white
                      transition-all duration-200 cursor-default"
                  >
                    <Icon size={14} className="text-secondary" />
                    {t(cap.label)}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link
                href="/smart-ai-chatbot"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5
                  bg-secondary text-white rounded-full
                  font-bold text-sm hover:bg-secondary/90
                  transition-all duration-300 shadow-lg shadow-secondary/25"
              >
                <FaRobot size={15} />
                {t("ai.cta")}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Live chat preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Chat window */}
            <div
              className="bg-black/40 backdrop-blur-xl border border-white/10
              rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-3 px-5 py-4
                border-b border-white/8 bg-white/5"
              >
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {/* Glowing pulse avatar */}
                  <div className="relative">
                    <div
                      className="w-7 h-7 rounded-full bg-secondary/30 border border-secondary/50
                      flex items-center justify-center"
                    >
                      <FaRobot size={13} className="text-secondary" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-secondary/30"
                    />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">
                      SmartAgri AI
                    </p>
                    <p className="text-secondary text-[10px] leading-tight">
                      ● Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 min-h-[280px]">
                {CHAT.map((msg, i) => (
                  <ChatBubble key={i} {...msg} inView={inView} />
                ))}
              </div>

              {/* Input bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 2.8, duration: 0.5 }}
                className="px-5 py-4 border-t border-white/8 bg-white/5
                  flex items-center gap-3"
              >
                <div
                  className="flex-1 bg-white/8 border border-white/10
                  rounded-full px-4 py-2.5 text-white/30 text-sm"
                >
                 {t("ai.placeholder")}
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-secondary/20
                  flex items-center justify-center
                  hover:bg-secondary/40 transition-colors duration-200"
                >
                  <Mic size={15} className="text-secondary" />
                </button>
              </motion.div>
            </div>

            {/* Below chat note */}
            <p className="text-white/25 text-xs text-center mt-4">
             {t("ai.footer")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
