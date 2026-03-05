"use client";

/**
 * PlannerHighlight
 * planner-bg.jpg — aerial green field with tractors
 * Full bleed right side, 3-step process visualization left
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarDays, ArrowUpRight, MapPin, Sprout, FileText, Check } from "lucide-react";

const STEPS = [
  {
    icon: Sprout,
    title: "Choose Crop & Season",
    desc: "Select your crop type, planting date, and season from our Bangladesh-specific database.",
  },
  {
    icon: MapPin,
    title: "Set Your Location",
    desc: "Enter your division, district, and upazila for hyper-local recommendations.",
  },
  {
    icon: FileText,
    title: "Get Your Full Plan",
    desc: "Receive a complete seasonal plan — irrigation schedule, fertilizer doses, pest alerts, and harvest date.",
  },
];

export default function PlannerHighlight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-background">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[640px]">

          {/* LEFT: Content */}
          <div className="flex flex-col justify-center px-8 lg:px-14 py-20 lg:py-28 relative">

            {/* Decorative ghost text */}
            <div className="absolute bottom-8 left-8 pointer-events-none select-none">
              <span className="text-[100px] font-extrabold text-primary/[0.04] leading-none">
                PLAN
              </span>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-primary/10 border border-primary/20
                  text-primary text-xs font-bold tracking-widest uppercase mb-6 w-fit"
              >
                <CalendarDays size={13} />
                Smart Farm Planner
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl lg:text-5xl font-extrabold text-foreground
                  leading-tight tracking-tight mb-5"
              >
                Your Season,{" "}
                <br />
                <span className="text-primary">Perfectly Planned</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-muted-foreground text-lg leading-relaxed mb-10"
              >
                Answer 3 simple questions. Get a complete Bangladesh DAE-certified
                farm plan tailored to your land, location, and crop.
              </motion.p>

              {/* Steps */}
              <div className="space-y-5 mb-10">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -24 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.3 + i * 0.12,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex gap-4 items-start group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10
                        flex items-center justify-center shrink-0
                        group-hover:bg-primary group-hover:scale-110
                        transition-all duration-300">
                        <Icon size={17} className="text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-base mb-0.5">{step.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Link
                  href="/planner"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5
                    bg-primary text-primary-foreground rounded-full font-bold text-sm
                    hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20"
                >
                  Generate My Farm Plan
                  <ArrowUpRight size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] lg:min-h-full overflow-hidden order-first lg:order-last"
          >
            <Image
              src="/images/planner-bg.jpg"
              alt="Aerial farm planning"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/50 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md
                border border-white/50 rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="text-foreground font-bold text-sm">📋 DAE Certified Guidelines</p>
              <p className="text-muted-foreground text-xs mt-0.5">Bangladesh agriculture standards</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}