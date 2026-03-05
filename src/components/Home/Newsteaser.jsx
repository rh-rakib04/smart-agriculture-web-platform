"use client";

/**
 * NewsTeaser
 * Light section (bg-background) — 3 news cards with images
 * Cards have hover lift + image zoom effect
 */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Newspaper } from "lucide-react";

const NEWS = [
  {
    category: "Policy",
    categoryColor: "bg-primary/10 text-primary border-primary/20",
    title: "Government Announces New Subsidy Programme for Digital Farming Tools",
    excerpt: "The Ministry of Agriculture has approved a major digital farming initiative targeting smallholder farmers across all 64 districts.",
    date: "March 2025",
    image: "/images/news-1.jpg",
  },
  {
    category: "Technology",
    categoryColor: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    title: "AI Disease Detection Now Supports 47 Crop Varieties in Bangladesh",
    excerpt: "SmartAgri's computer vision model has been retrained on 200,000+ images from local farms, achieving 94% detection accuracy.",
    date: "February 2025",
    image: "/images/news-2.jpg",
  },
  {
    category: "Market",
    categoryColor: "bg-highlight/10 text-amber-700 border-highlight/20",
    title: "Direct Farmer-Buyer Trade Volume Grows 3× This Harvest Season",
    excerpt: "Platform data shows record transaction volumes as more farmers bypass traditional wholesale channels in favour of direct sales.",
    date: "January 2025",
    image: "/images/news-3.jpg",
  },
];

function NewsCard({ item, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: 0.2 + index * 0.15,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group bg-card border border-border rounded-3xl overflow-hidden
        hover:shadow-xl hover:-translate-y-2 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${item.categoryColor}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-muted-foreground text-xs font-medium mb-3">{item.date}</p>
        <h3 className="text-card-foreground font-extrabold text-lg leading-snug mb-3
          group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">
          {item.excerpt}
        </p>
        <div className="flex items-center gap-1 text-primary text-sm font-bold
          group-hover:gap-2 transition-all duration-200">
          Read More <ArrowUpRight size={15} />
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-background py-24 lg:py-32">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                bg-primary/10 border border-primary/20
                text-primary text-xs font-bold tracking-widest uppercase mb-5"
            >
              <Newspaper size={13} />
              Latest News
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl lg:text-5xl font-extrabold text-foreground
                leading-tight tracking-tight"
            >
              Agriculture News &{" "}
              <span className="text-primary">Updates</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 px-6 py-3
                border-2 border-primary text-primary rounded-full font-bold text-sm
                hover:bg-primary hover:text-white transition-all duration-300"
            >
              View All News
              <ArrowUpRight size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {NEWS.map((item, i) => (
            <Link href="/news" key={item.title}>
              <NewsCard item={item} index={i} inView={inView} />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}