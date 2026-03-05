"use client";

/**
 * AboutUs
 * Sits before CTASection.
 *
 * Design:
 * - Light bg-background section — palette cleanser after dark Testimonials
 * - Left: mission statement, story paragraph, two impact numbers
 * - Right: stacked image collage (farmer-feature + student-bg) with
 *   overlapping layout and a floating "Why We Built This" card
 * - Feels human, warm, mission-driven with real impact numbers
 */

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Heart,
  Sprout,
  Users,
  Globe,
  Handshake,
  Microscope,
} from "lucide-react";

// ─── Impact numbers ───────────────────────────────────────────────────────────

const IMPACTS = [
  {
    icon: Sprout,
    value: "12,400+",
    label: "Farmers Empowered",
    desc: "Earning fairer prices",
  },
  {
    icon: Globe,
    value: "64",
    label: "Districts Reached",
    desc: "Nationwide coverage",
  },
  {
    icon: Users,
    value: "3,800+",
    label: "Buyers Connected",
    desc: "Direct relationships built",
  },
  {
    icon: Heart,
    value: "40%",
    label: "Income Increase",
    desc: "Average per farmer",
  },
];

// ─── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Sprout,
    title: "Farmer First",
    desc: "Every feature is built with the farmer's livelihood in mind.",
  },
  {
    icon: Handshake,
    title: "No Middlemen",
    desc: "We believe in fair, transparent, direct trade.",
  },
  {
    icon: Microscope,
    title: "Science-Backed",
    desc: "All recommendations follow Bangladesh DAE guidelines.",
  },
  {
    icon: Globe,
    title: "Built for Bangladesh",
    desc: "Designed for local crops, districts, and agricultural seasons.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className=" overflow-hidden py-24 lg:py-32">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ── LEFT: Content ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-primary/10 border border-primary/20
                text-primary text-xs font-bold tracking-widest uppercase mb-6"
            >
              <Heart size={13} />
              About SmartAgri
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.1,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl lg:text-5xl font-extrabold text-foreground
                leading-tight tracking-tight mb-6"
            >
              Built for the Farmers
              <br />
              <span className="text-primary">Who Feed Bangladesh</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="space-y-4 text-muted-foreground text-base leading-relaxed mb-10"
            >
              <p>
                SmartAgri was born from a simple question — why do Bangladeshi
                farmers, who grow food for 170 million people, earn so little
                from their harvests while brokers and middlemen take the
                lion&apos;s share?
              </p>
              <p>
                We built a platform that cuts out the middleman entirely, puts
                AI-powered tools in every farmer&apos;s hands, and connects
                agriculture students with the field knowledge they need. Because
                the future of Bangladesh&apos;s food security depends on
                empowering the people who actually grow the food.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="grid grid-cols-2 gap-3 mb-10"
            >
              {VALUES.map((v, i) => {
                const Icon = v.icon;

                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    className="bg-card border border-border rounded-2xl p-4
        hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl bg-primary/10 
        flex items-center justify-center mb-3
        group-hover:scale-110 transition-transform duration-200"
                    >
                      <Icon size={18} className="text-primary" />
                    </div>

                    <h4
                      className="text-foreground font-bold text-sm mb-1
        group-hover:text-primary transition-colors duration-200"
                    >
                      {v.title}
                    </h4>

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {v.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Impact numbers */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {IMPACTS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-primary/10
                      flex items-center justify-center shrink-0"
                    >
                      <Icon size={17} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-extrabold text-xl leading-tight">
                        {stat.value}
                      </p>
                      <p className="text-foreground font-semibold text-xs leading-tight">
                        {stat.label}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {stat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ── RIGHT: Image collage ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main large image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src="/images/farmer-feature.jpg"
                alt="Farmer planting rice"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t
                from-black/40 via-transparent to-transparent"
              />
            </div>

            {/* Overlapping smaller image — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -top-6 -right-6 w-48 h-48 lg:w-56 lg:h-56
                rounded-2xl overflow-hidden border-4 border-background shadow-xl"
            >
              <Image
                src="/images/student-bg.jpg"
                alt="Agricultural research"
                fill
                className="object-cover object-center"
                sizes="220px"
                quality={85}
              />
            </motion.div>

            {/* Floating mission card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.8,
                duration: 0.7,
                type: "spring",
                stiffness: 120,
              }}
              className="absolute -bottom-6 -left-6
                bg-primary text-primary-foreground
                rounded-2xl px-6 py-5 shadow-2xl max-w-[220px]"
            >
              <p className="text-2xl font-extrabold leading-none mb-1">
                Our Mission
              </p>
              <p className="text-primary-foreground/75 text-xs leading-relaxed">
                Empower every Bangladeshi farmer with the tools, data, and
                connections they deserve.
              </p>
            </motion.div>

            {/* Decorative dot grid */}
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, #2E7D32 1px, transparent 1px)`,
                backgroundSize: "12px 12px",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
