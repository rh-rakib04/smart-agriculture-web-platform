"use client";

/**
 * BuyerFeatures
 *
 * Design:
 * - buyer-feature.jpg (vibrant vegetable market, colorful, busy) — used on
 *   the RIGHT side in a split layout, image-right to alternate from FarmerFeatures.
 * - Left side is light bg-background (cream) with content — strong contrast
 *   coming off the dark FarmerFeatures section.
 * - "No Middlemen" is the hero message — large typographic treatment.
 * - Three features displayed as horizontal icon+text rows, clean and airy.
 * - Decorative large faded text "DIRECT" behind the heading for depth.
 */
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShoppingBasket,
  Shield,
  MessageSquare,
  ArrowUpRight,
  Check,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: ShoppingBasket,
    title: "buyer.feature1Title",
    desc: "buyer.feature1Desc",
  },
  {
    icon: Shield,
    title: "buyer.feature2Title",
    desc: "buyer.feature2Desc",
  },
  {
    icon: MessageSquare,
    title: "buyer.feature3Title",
    desc: "buyer.feature3Desc",
  },
];

const PERKS = ["buyer.perk1", "buyer.perk2", "buyer.perk3", "buyer.perk4"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BuyerFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();
  return (
    <section ref={ref} className="bg-background overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[680px]">
          {/* ── LEFT: Content ── */}
          <div
            className="flex flex-col justify-center
            px-8 lg:px-14 py-16 lg:py-24 order-2 lg:order-1 relative"
          >
            {/* Large decorative background text */}
            <div
              className="absolute inset-0 flex items-center justify-start
              pl-8 lg:pl-14 pointer-events-none overflow-hidden"
            >
              <span
                className="text-[120px] lg:text-[160px] font-extrabold
                text-primary/[0.04] leading-none select-none tracking-tighter"
              >
                {t("buyer.decorative")}
              </span>
            </div>

            <div className="relative z-10">
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-highlight/15 border border-highlight/25
                  text-primary text-xs font-bold tracking-widest uppercase mb-6 w-fit"
              >
                <ShoppingBasket size={13} />
                {t("buyer.label")}
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-4xl lg:text-5xl xl:text-6xl font-extrabold
                  text-foreground leading-tight tracking-tight mb-5"
              >
                {t("buyer.title1")} <br />
                <span className="text-primary">{t("buyer.title2")}</span>
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-muted-foreground text-lg leading-relaxed mb-10"
              >
                {t("buyer.subtitle")}
              </motion.p>

              {/* Feature rows */}
              <div className="space-y-6 mb-10">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, x: -24 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.3 + i * 0.1,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex gap-4 group"
                    >
                      <div
                        className="w-11 h-11 rounded-2xl bg-primary/10
                        flex items-center justify-center shrink-0
                        group-hover:bg-primary group-hover:scale-110
                        transition-all duration-300"
                      >
                        <Icon
                          size={18}
                          className="text-primary group-hover:text-white
                          transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-base mb-0.5">
                          {t(f.title)}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {t(f.desc)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Perks checklist */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="grid grid-cols-2 gap-2 mb-10"
              >
                {PERKS.map((perk) => (
                  <div key={perk} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full bg-secondary/20
                      flex items-center justify-center shrink-0"
                    >
                      <Check size={10} className="text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {t(perk)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.75, duration: 0.6 }}
              >
                <Link
                  href="/buyer"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5
                    bg-primary text-primary-foreground rounded-full
                    font-bold text-sm hover:bg-primary/90
                    transition-all duration-300 shadow-md shadow-primary/20"
                >
                  {t("buyer.cta")}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300
                      group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT: Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[420px] lg:min-h-full overflow-hidden order-1 lg:order-2"
          >
            <Image
              src="/images/buyer-feature.jpg"
              alt="Fresh produce at a farmers market"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
            />

            {/* Left-side gradient fade into bg-background */}
            <div
              className="absolute inset-0 bg-gradient-to-l
              from-transparent via-transparent to-background/50
              hidden lg:block"
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-t
              from-black/30 via-transparent to-transparent"
            />

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="absolute bottom-8 right-8
                bg-white/90 backdrop-blur-md border border-white/50
                rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="text-foreground font-bold text-sm">
                🛒 {t("buyer.badgeTitle")}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {t("buyer.badgeDesc")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
