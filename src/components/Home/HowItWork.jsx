"use client";

/**
 * HowItWorks
 *
 * Design:
 * - Dark section (bg-foreground) — creates strong contrast between the
 *   light BuyerFeatures and the upcoming AIChatbot section.
 * - Three steps with large illustrated number, icon, title, desc.
 * - Animated dashed connecting arrow between steps on desktop.
 * - Subtle background: planner-bg.jpg (aerial green field + tractors)
 *   at very low opacity as a texture — just enough to feel organic.
 * - Steps animate in with stagger as they enter the viewport.
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sprout,
  Brain,
  ShoppingBasket,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    icon: Sprout,
    title: "Farmer Lists Crops",
    desc: "Farmers upload harvest details — crop type, quantity, quality grade, location, and expected ready date. Takes under 2 minutes.",
    color: "from-primary to-green-700",
    iconBg: "bg-primary/20",
    iconColor: "text-secondary",
    numColor: "text-secondary/20",
  },
  {
    num: "02",
    icon: Brain,
    title: "AI Validates & Prices",
    desc: "Our AI verifies the listing, suggests a fair market price based on live data, and surfaces it to the most relevant buyers nearby.",
    color: "from-highlight/80 to-amber-600",
    iconBg: "bg-highlight/15",
    iconColor: "text-highlight",
    numColor: "text-highlight/15",
  },
  {
    num: "03",
    icon: ShoppingBasket,
    title: "Buyer Connects Directly",
    desc: "Buyers browse, message farmers directly, negotiate terms, and finalise deals — no broker, no commission, no delay.",
    color: "from-secondary to-primary",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
    numColor: "text-secondary/20",
  },
];

// ─── Arrow connector ──────────────────────────────────────────────────────────

function Connector({ inView, delay }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-16 shrink-0 mt-10">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="flex items-center gap-1 w-full"
      >
        <div className="flex-1 h-px border-t-2 border-dashed border-white/20" />
        <ArrowRight size={16} className="text-white/20 shrink-0" />
      </motion.div>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({ step, index, inView }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.2 + index * 0.18,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex-1 group"
    >
      {/* Card */}
      <div
        className="relative h-full bg-white/[0.04] hover:bg-white/[0.08]
        border border-white/10 hover:border-white/20
        rounded-3xl p-8 transition-all duration-400 overflow-hidden"
      >
        {/* Giant ghost number */}
        <div
          className={`absolute -top-4 -right-2 text-[110px] font-extrabold
          leading-none select-none pointer-events-none
          ${step.numColor}`}
        >
          {step.num}
        </div>

        {/* Icon */}
        <div
          className={`relative z-10 w-14 h-14 rounded-2xl ${step.iconBg}
          flex items-center justify-center mb-6
          group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={26} className={step.iconColor} />
        </div>

        {/* Step label */}
        <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase mb-2">
          Step {step.num}
        </p>

        {/* Title */}
        <h3 className="text-white font-extrabold text-xl mb-3 leading-tight">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>

        {/* Bottom gradient accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[3px]
          bg-gradient-to-r ${step.color}
          opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative bg-foreground overflow-hidden py-24 lg:py-32"
    >
      {/* ── Subtle background image texture ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/planner-bg.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-[0.06]"
          sizes="100vw"
          aria-hidden
          quality={90}
        />
      </div>

      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
        w-[600px] h-40 bg-primary/20 blur-3xl pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-1/4
        w-80 h-32 bg-highlight/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-highlight/15 border border-highlight/25
              text-highlight text-xs font-bold tracking-widest uppercase mb-5"
          >
            How It Works
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl lg:text-5xl xl:text-6xl font-extrabold
              text-white leading-tight tracking-tight mb-5"
          >
            Simple. Direct. <span className="text-highlight">Transparent.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Three steps connect a farmer&apos;s harvest directly to a
            buyer&apos;s table — with AI making sure every deal is fair.
          </motion.p>
        </div>

        {/* Steps + connectors */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
          {STEPS.map((step, i) => (
            <>
              <StepCard key={step.num} step={step} index={i} inView={inView} />
              {i < STEPS.length - 1 && (
                <Connector
                  key={`connector-${i}`}
                  inView={inView}
                  delay={0.4 + i * 0.18}
                />
              )}
            </>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="text-center mt-14"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2.5 px-8 py-4
              bg-highlight text-gray-900 rounded-full
              font-bold text-base hover:brightness-110
              transition-all duration-300 shadow-lg shadow-highlight/25"
          >
            Get Started Free
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
