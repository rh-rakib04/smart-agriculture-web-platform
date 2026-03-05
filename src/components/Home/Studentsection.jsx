"use client";

/**
 * StudentSection
 * student-bg.jpg — hands holding plant seedling in petri dish, research lab
 * Split layout: image left, content right
 * Highlights student research + farmer consultation + market data
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FlaskConical, TrendingUp, Users, Brain, ArrowUpRight, GraduationCap } from "lucide-react";

const FEATURES = [
  {
    icon: FlaskConical,
    title: "Research Collaboration",
    desc: "Connect with verified farmers for field studies, soil data, and agricultural research projects across Bangladesh.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Users,
    title: "Farmer Consultation Network",
    desc: "Build direct relationships with experienced farmers for mentorship, thesis guidance, and on-ground insights.",
    color: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Live Market Analytics",
    desc: "Access real-time crop prices, demand curves, and seasonal trends — perfect for academic research and reports.",
    color: "bg-highlight/15",
    iconColor: "text-primary",
  },
  {
    icon: Brain,
    title: "AI Learning Assistant",
    desc: "Use the AI assistant to explore agricultural science, get research explanations, and deepen your agronomic knowledge.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function StudentSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative bg-foreground overflow-hidden py-24 lg:py-32">

      {/* Subtle student-bg texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/student-bg.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-[0.08]"
          sizes="100vw"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/80 to-primary/30" />

      {/* Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-40 bg-highlight/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* LEFT: Image card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0
              shadow-2xl border border-white/10">
              <Image
                src="/images/student-bg.jpg"
                alt="Agricultural research"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating research badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
                className="absolute top-6 left-6 bg-white/10 backdrop-blur-md
                  border border-white/20 rounded-2xl px-4 py-3"
              >
                <p className="text-white font-bold text-sm">🔬 Active Research</p>
                <p className="text-white/60 text-xs mt-0.5">240+ students connected</p>
              </motion.div>

              {/* Bottom label */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-extrabold text-xl leading-tight">
                  Where Research Meets Reality
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Field access across 64 districts
                </p>
              </div>
            </div>

            {/* Decorative dot grid */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, #66BB6A 1px, transparent 1px)`,
                backgroundSize: "14px 14px",
              }}
            />
          </motion.div>

          {/* RIGHT: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-secondary/20 border border-secondary/30
                text-secondary text-xs font-bold tracking-widest uppercase mb-6"
            >
              <GraduationCap size={13} />
              For Students & Researchers
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl lg:text-5xl font-extrabold text-white
                leading-tight tracking-tight mb-5"
            >
              Bridge the Gap Between{" "}
              <span className="text-secondary">Lab & Field</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-white/55 text-lg leading-relaxed mb-10"
            >
              Agriculture students and researchers can connect directly
              with farmers, access live market data, and collaborate
              on real field studies — no bureaucracy, no middlemen.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="bg-white/[0.05] hover:bg-white/[0.09] border border-white/8
                      rounded-2xl p-5 group transition-all duration-300"
                  >
                    <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center mb-3
                      group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={17} className={f.iconColor} />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.6 }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5
                  bg-secondary text-white rounded-full font-bold text-sm
                  hover:bg-secondary/90 transition-all duration-300
                  shadow-lg shadow-secondary/20"
              >
                Join as Student
                <ArrowUpRight size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}