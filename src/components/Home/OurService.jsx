"use client";

/**
 * OurService
 * Sits after BuyerFeatures.
 *
 * Design:
 * - Dark bg-foreground section with a subtle planner-bg.jpg texture
 * - 5 service cards in a asymmetric grid (3 top + 2 bottom centered)
 * - Each card has an animated icon, number tag, hover glow border
 * - Cards animate in with staggered reveal from bottom
 * - Active/hovered card expands slightly with a colored glow
 */
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  Brain,
  ShoppingBasket,
  CloudSun,
  FlaskConical,
  ArrowUpRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    icon: Sprout,
    title: "service.item1Title",
    desc: "service.item1Desc",
    href: "/farmer",
    gradient: "from-primary/20 to-emerald-700/10",
    glow: "shadow-primary/20",
    iconBg: "bg-primary/20",
    iconColor: "text-secondary",
    accentBar: "from-primary to-secondary",
  },
  {
    num: "02",
    icon: ShoppingBasket,
    title: "service.item2Title",
    desc: "service.item2Desc",
    href: "/buyer",
    gradient: "from-highlight/15 to-amber-700/10",
    glow: "shadow-highlight/20",
    iconBg: "bg-highlight/15",
    iconColor: "text-highlight",
    accentBar: "from-highlight to-amber-500",
  },
  {
    num: "03",
    icon: Brain,
    title: "service.item3Title",
    desc: "service.item3Desc",
    href: "/smart-ai-chatbot",
    gradient: "from-secondary/15 to-green-800/10",
    glow: "shadow-secondary/20",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
    accentBar: "from-secondary to-primary",
  },
  {
    num: "04",
    icon: CloudSun,
    title: "service.item4Title",
    desc: "service.item4Desc",
    href: "/farmer/weather",
    gradient: "from-sky-500/15 to-blue-800/10",
    glow: "shadow-sky-500/20",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-300",
    accentBar: "from-sky-400 to-blue-500",
  },
  {
    num: "05",
    icon: FlaskConical,
    title: "service.item5Title",
    desc: "service.item5Desc",
    href: "/register",
    gradient: "from-purple-500/10 to-primary/10",
    glow: "shadow-purple-500/15",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-300",
    accentBar: "from-purple-400 to-secondary",
  },
];

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, index, inView }) {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.15 + index * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group rounded-3xl border border-white/8 overflow-hidden
        bg-gradient-to-br ${service.gradient}
        hover:border-white/20 hover:shadow-2xl ${service.glow}
        transition-all duration-500 cursor-default`}
    >
      {/* Animated inner glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60 pointer-events-none`}
      />

      <div className="relative z-10 p-7 flex flex-col h-full min-h-[240px]">
        {/* Top row: icon + number */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? 6 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`w-13 h-13 w-12 h-12 rounded-2xl ${service.iconBg}
              flex items-center justify-center`}
          >
            <Icon size={22} className={service.iconColor} />
          </motion.div>

          <span className="text-4xl font-extrabold text-white/[0.06] leading-none select-none">
            {service.num}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-extrabold text-lg leading-snug mb-3">
          {t(service.title)}
        </h3>

        {/* Desc */}
        <p
          className="text-white/45 text-sm leading-relaxed flex-1 group-hover:text-white/65
          transition-colors duration-300"
        >
          {t(service.desc)}
        </p>

        {/* Arrow link */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
          className="mt-5 flex items-center gap-1.5"
        >
          <Link
            href={service.href}
            className={`text-xs font-bold tracking-widest uppercase ${service.iconColor}
              flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200`}
          >
            {t("service.learnMore")} <ArrowUpRight size={13} />
          </Link>
        </motion.div>
      </div>

      {/* Bottom accent bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[3px]
        bg-gradient-to-r ${service.accentBar}
        opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
      />
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OurService() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();
  return (
    <section
      ref={ref}
      className="relative bg-foreground overflow-hidden py-24 lg:py-32"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/planner-bg.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-[0.04]"
          sizes="100vw"
          aria-hidden
        />
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-highlight/8 blur-3xl pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-60 bg-secondary/5 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-secondary/20 border border-secondary/30
              text-secondary text-xs font-bold tracking-widest uppercase mb-5"
          >
            <Sprout size={13} />
            {t("service.label")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white
              leading-tight tracking-tight mb-5"
          >
            {t("service.title1")}
            <br />
            <span className="text-highlight">{t("service.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed"
          >
            {t("service.subtitle")}
          </motion.p>
        </div>

        {/* Cards — 3 top + 2 bottom centered */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {SERVICES.slice(0, 3).map((s, i) => (
            <ServiceCard key={s.num} service={s} index={i} inView={inView} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {SERVICES.slice(3).map((s, i) => (
            <ServiceCard
              key={s.num}
              service={s}
              index={i + 3}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
