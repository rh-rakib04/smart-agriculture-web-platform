"use client";

/**
 * CTASection
 * Full bleed hero-bg.jpg reused — creates a bookend effect with the top hero.
 * Centered content, two CTAs, floating animated elements.
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sprout } from "lucide-react";
import { FaRobot } from "react-icons/fa";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden py-32 lg:py-40">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        aria-hidden
      />
      {/* Heavy overlay — same warm-left treatment as hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

      {/* Floating animated leaves */}
      {["🌿", "🌾", "🍃", "🌱"].map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-10 pointer-events-none select-none"
          style={{
            top: `${20 + i * 18}%`,
            left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
            right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        >
          {leaf}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-highlight/20 border border-highlight/30
            text-highlight text-xs font-bold tracking-widest uppercase mb-8"
        >
          <Sprout size={13} />
          Get Started Today
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white
            leading-tight tracking-tight mb-6 max-w-4xl mx-auto"
        >
          Ready to Transform{" "}
          <span className="text-highlight">Your Agriculture?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="text-white/60 text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
        >
          Join thousands of farmers and buyers across Bangladesh using
          SmartAgri to grow smarter, trade fairer, and earn more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2.5 px-9 py-4
              bg-highlight text-gray-900 rounded-full font-bold text-base
              hover:brightness-110 transition-all duration-300
              shadow-xl shadow-highlight/30"
          >
            <Sprout size={18} />
            Start as Farmer
            <ArrowUpRight size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/buyer"
            className="group inline-flex items-center gap-2.5 px-9 py-4
              bg-white/10 backdrop-blur-sm border border-white/25
              text-white rounded-full font-bold text-base
              hover:bg-white/20 transition-all duration-300"
          >
            Browse as Buyer
            <ArrowUpRight size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/smart-ai-chatbot"
            className="group inline-flex items-center gap-2.5 px-9 py-4
              bg-secondary/80 backdrop-blur-sm border border-secondary/50
              text-white rounded-full font-bold text-base
              hover:bg-secondary transition-all duration-300"
          >
            <FaRobot size={16} />
            Try AI Free
          </Link>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-white/25 text-sm"
        >
          Free to join · No credit card · Available in Bengali & English
        </motion.p>

      </div>
    </section>
  );
}