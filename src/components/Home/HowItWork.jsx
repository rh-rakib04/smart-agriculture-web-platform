"use client";

/**
 * HowItWorks
 *
 * Redesigned as a LIGHT section (bg-background cream) to break the
 * dark OurService → dark HowItWorks blend.
 *
 * Design:
 * - Clean cream bg-background with bold numbered steps
 * - Large oversized step numbers as decorative typography
 * - Horizontal layout on desktop with diagonal connector arrows
 * - Each step card has a colored top border accent
 * - planner-bg.jpg used as a subtle right-side panel image
 *   to add visual interest without going full-dark
 */

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sprout, Brain, ShoppingBasket, ArrowUpRight, ArrowRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    icon: Sprout,
    title: "Farmer Lists Crops",
    desc: "Farmers upload harvest details — crop type, quantity, quality grade, location, and expected ready date. Takes under 2 minutes.",
    accent: "border-t-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    numColor: "text-primary/10",
    tag: "For Farmers",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    num: "02",
    icon: Brain,
    title: "AI Validates & Prices",
    desc: "Our AI verifies the listing, suggests a fair market price based on live data, and surfaces it to the most relevant buyers nearby.",
    accent: "border-t-highlight",
    iconBg: "bg-highlight/15",
    iconColor: "text-amber-700",
    numColor: "text-highlight/15",
    tag: "Powered by AI",
    tagColor: "bg-highlight/15 text-amber-700",
  },
  {
    num: "03",
    icon: ShoppingBasket,
    title: "Buyer Connects Directly",
    desc: "Buyers browse, message farmers directly, negotiate terms, and finalise deals — no broker, no commission, no delay.",
    accent: "border-t-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    numColor: "text-secondary/10",
    tag: "For Buyers",
    tagColor: "bg-secondary/10 text-secondary",
  },
];

// ─── Connector ────────────────────────────────────────────────────────────────

function Connector({ inView, delay }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-12 shrink-0 pb-8">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="flex items-center gap-1 w-full"
      >
        <div className="flex-1 h-px border-t-2 border-dashed border-border" />
        <ArrowRight size={16} className="text-muted-foreground/40 shrink-0" />
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
        delay: 0.2 + index * 0.15,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative flex-1 bg-card border border-border border-t-4 ${step.accent}
        rounded-3xl p-8 group hover:shadow-xl hover:-translate-y-2
        transition-all duration-400 overflow-hidden`}
    >
      {/* Ghost number */}
      <div className={`absolute -bottom-4 -right-2 text-[100px] font-extrabold
        leading-none select-none pointer-events-none ${step.numColor}`}>
        {step.num}
      </div>

      {/* Tag */}
      <span className={`inline-flex items-center px-3 py-1 rounded-full
        text-xs font-bold mb-5 ${step.tagColor}`}>
        {step.tag}
      </span>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl ${step.iconBg}
        flex items-center justify-center mb-5
        group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} className={step.iconColor} />
      </div>

      {/* Step label */}
      <p className="text-muted-foreground text-xs font-bold tracking-[0.2em] uppercase mb-2">
        Step {step.num}
      </p>

      {/* Title */}
      <h3 className="text-foreground font-extrabold text-xl mb-3 leading-tight
        group-hover:text-primary transition-colors duration-300">
        {step.title}
      </h3>

      {/* Desc */}
      <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
        {step.desc}
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px]">

          {/* ── LEFT: Main content ── */}
          <div className="px-8 lg:px-14 py-24 lg:py-32">

            {/* Header */}
            <div className="mb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-primary/10 border border-primary/20
                  text-primary text-xs font-bold tracking-widest uppercase mb-5"
              >
                How It Works
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl lg:text-5xl font-extrabold text-foreground
                  leading-tight tracking-tight mb-4"
              >
                Simple. Direct.{" "}
                <span className="text-primary">Transparent.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-muted-foreground text-lg leading-relaxed max-w-lg"
              >
                Three steps connect a farmer&apos;s harvest directly to a buyer&apos;s
                table — with AI making every deal fast and fair.
              </motion.p>
            </div>

            {/* Steps + connectors */}
            <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0 mb-12">
              {STEPS.map((step, i) => (
                <Fragment key={step.num}>
                  <StepCard key={step.num} step={step} index={i} inView={inView} />
                  {i < STEPS.length - 1 && (
                    <Connector key={`c-${i}`} inView={inView} delay={0.4 + i * 0.15} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5
                  bg-primary text-primary-foreground rounded-full
                  font-bold text-sm hover:bg-primary/90
                  transition-all duration-300 shadow-md shadow-primary/20"
              >
                Get Started Free
                <ArrowUpRight size={16}
                  className="transition-transform duration-300
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Image panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <Image
              src="/images/planner-bg.jpg"
              alt="Aerial farm"
              fill
              className="object-cover object-center"
              sizes="380px"
              quality={90}
            />
            {/* Left gradient fade into bg-background */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
            {/* Top + bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />

            {/* Floating stat pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-white/90 backdrop-blur-md border border-border
                rounded-2xl px-6 py-4 shadow-xl text-center"
            >
              <p className="text-4xl font-extrabold text-primary">3x</p>
              <p className="text-foreground font-bold text-sm">Faster Trade</p>
              <p className="text-muted-foreground text-xs">vs traditional channels</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}