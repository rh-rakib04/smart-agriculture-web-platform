"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, Newspaper, Wheat, CloudRain,
  LandPlot, TrendingUp, ExternalLink,
  Clock, RefreshCw, Zap, AlertCircle,
} from "lucide-react";
import Header from "@/components/shared/Header";

// ─── Pure time helper (no Date.now() inside render) ──────────────────────────

function getTimeAgo(pubDate, now) {
  const date = new Date(pubDate);
  const diff = now - date.getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1)  return "Just now";
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return date.toLocaleDateString("en-BD", { day: "numeric", month: "short" });
}

// ─── Resolve CSS variable to computed color ───────────────────────────────────
// Called client-side only; returns the computed hex/rgb value of a CSS variable.
function useAccent(tab) {
  const [accent, setAccent] = useState("#2E7D32");
  useEffect(() => {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue(tab.accentVar).trim();
    if (val) setAccent(val);
  }, [tab.accentVar]);
  const accentLight = `${accent}${tab.accentAlpha}`;
  return { accent, accentLight };
}



// Accents use CSS variables so they respect the theme (light/dark)
const TABS = [
  { id: "all",     label: "All News", icon: Newspaper,  accentVar: "--color-primary",   accentAlpha: "18", badge: "Latest"      },
  { id: "crops",   label: "Crops",    icon: Wheat,       accentVar: "--color-chart-3",   accentAlpha: "22", badge: "Cultivation" },
  { id: "weather", label: "Weather",  icon: CloudRain,   accentVar: "--color-chart-2",   accentAlpha: "22", badge: "Climate"     },
  { id: "policy",  label: "Policy",   icon: LandPlot,    accentVar: "--color-chart-4",   accentAlpha: "22", badge: "Government"  },
  { id: "market",  label: "Market",   icon: TrendingUp,  accentVar: "--color-chart-5",   accentAlpha: "22", badge: "Prices"      },
];

// ─── Floating leaves ──────────────────────────────────────────────────────────

function FloatingLeaves() {
  const leaves = ["🌿", "🌾", "🍃", "🌱"];
  return (
    <>
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            top:   `${15 + i * 18}%`,
            left:  i % 2 === 0 ? `${4 + i * 2}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i * 2}%` : undefined,
          }}
          animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 5 + i * 1.5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
        >
          {leaf}
        </motion.div>
      ))}
    </>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function PageBanner() {
  return (
    <div className="relative h-56 sm:h-64 w-full">
      <Image
        src="/images/planner-bg.jpg"
        alt="Agri News"
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={90}
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/75" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
      <FloatingLeaves />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-highlight/20 border border-highlight/40 text-highlight
            text-xs font-bold tracking-widest uppercase mb-4"
        >
          <Newspaper size={13} />
          Agri News Feed
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3"
        >
          Stay Ahead of the{" "}
          <span className="text-highlight">Season.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/60 text-sm max-w-sm"
        >
          Live agriculture news from Bangladesh and beyond — crops, weather, policy & markets
        </motion.p>
      </div>
    </div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function TabButton({ tab, isActive, onClick, index }) {
  const Icon = tab.icon;
  const { accent, accentLight } = useAccent(tab);
  return (
    <motion.button
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
        transition-colors whitespace-nowrap focus:outline-none"
      style={{
        color:           isActive ? tab.accent : undefined,
        backgroundColor: isActive ? tab.accentLight : "transparent",
      }}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="news-tab-underline"
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
            style={{ backgroundColor: tab.accent }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="p-4 rounded-2xl border border-border bg-muted/30 space-y-3"
    >
      <div className="h-3 bg-muted rounded-full w-1/3 animate-pulse" />
      <div className="h-4 bg-muted rounded-full w-full animate-pulse" />
      <div className="h-4 bg-muted rounded-full w-4/5 animate-pulse" />
      <div className="h-3 bg-muted rounded-full w-2/3 animate-pulse" />
      <div className="flex gap-2 pt-1">
        <div className="h-3 bg-muted rounded-full w-16 animate-pulse" />
        <div className="h-3 bg-muted rounded-full w-20 animate-pulse" />
      </div>
    </motion.div>
  );
}

// ─── News card ────────────────────────────────────────────────────────────────

function NewsCard({ article, index, tab, now }) {
  const { accent, accentLight } = useAccent(tab);
  const timeAgo = getTimeAgo(article.pubDate, now);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative p-5 rounded-2xl border border-border bg-card
        hover:shadow-lg hover:shadow-black/8 transition-shadow duration-300 cursor-pointer"
    >
      {/* Accent left bar */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-0
          group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: accent }}
      />

      {/* Source + time */}
      <div className="flex items-center justify-between mb-3">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
          style={{ backgroundColor: accentLight, color: accent, border: `1px solid ${accent}25` }}
        >
          <Zap size={9} />
          {article.source}
        </motion.span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />
          {timeAgo}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-foreground text-sm leading-snug mb-2
        group-hover:text-primary transition-colors duration-200 line-clamp-2">
        {article.title}
      </h3>

      {/* Description */}
      {article.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {article.description}
        </p>
      )}

      {/* Read more */}
      <Link
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold
          opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: accent }}
        onClick={(e) => e.stopPropagation()}
      >
        Read full article
        <motion.span
          className="inline-flex"
          animate={{ x: 0 }}
          whileHover={{ x: 2 }}
        >
          <ExternalLink size={11} />
        </motion.span>
      </Link>
    </motion.div>
  );
}

// ─── Featured (first) card — with OG image preview ───────────────────────────

function FeaturedCard({ article, tab, now }) {
  const { accent, accentLight } = useAccent(tab);
  const timeAgo = getTimeAgo(article.pubDate, now);
  const [og, setOg]         = useState(null);
  const [ogLoading, setOgLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchOg() {
      try {
        const res  = await fetch(`/api/news/og?url=${encodeURIComponent(article.link)}`);
        const data = await res.json();
        if (!cancelled && data.success) setOg(data);
      } catch { /* silent — fallback to text-only */ }
      finally  { if (!cancelled) setOgLoading(false); }
    }
    fetchOg();
    return () => { cancelled = true; };
  }, [article.link]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl border overflow-hidden
        hover:shadow-xl hover:shadow-black/10 transition-shadow duration-300 col-span-full"
      style={{ borderColor: `${accent}30`, backgroundColor: accentLight }}
    >
      {/* OG image strip */}
      <AnimatePresence>
        {og?.image && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 200 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden"
            style={{ height: 200 }}
          >
            <img
              src={og.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        )}
        {ogLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-10 bg-muted/40 animate-pulse"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-6">
        {/* Badge row */}
        <div className="flex items-center justify-between gap-3 mb-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: accent }}>
              Featured
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate min-w-0">
            <Clock size={11} className="shrink-0" />
            {timeAgo} · {article.source}
          </span>
        </div>

        <h2 className="font-extrabold text-foreground text-lg sm:text-xl leading-snug mb-3
          group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {article.title}
        </h2>

        {/* Use OG description if richer, fallback to RSS description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {og?.description || article.description}
        </p>

        {/* Source domain pill + CTA */}
        <div className="flex items-center gap-3 flex-wrap">
          {og?.siteName && (
            <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-lg bg-border/60 border border-border">
              {og.siteName}
            </span>
          )}
          <Link
            href={og?.resolvedUrl || article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white
              transition-opacity duration-200 hover:opacity-90 w-fit"
            style={{ backgroundColor: accent }}
          >
            Read Full Story <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center gap-4 py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200
        flex items-center justify-center text-2xl">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <p className="font-bold text-foreground">Couldn&apos;t load news</p>
      <p className="text-sm text-muted-foreground max-w-xs">
        There was a problem fetching the latest articles. Check your connection or try again.
      </p>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold
          flex items-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <RefreshCw size={14} /> Try Again
      </motion.button>
    </motion.div>
  );
}

// ─── Section header (uses CSS-variable accent) ────────────────────────────────

function SectionHeader({ tab, articleCount }) {
  const { accent, accentLight } = useAccent(tab);
  const Icon = tab.icon;
  return (
    <div className="flex items-center gap-3 mb-6">
      <motion.div
        initial={{ scale: 0.6, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 250, delay: 0.05 }}
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: accentLight, border: `1px solid ${accent}30` }}
      >
        <Icon size={17} style={{ color: accent }} />
      </motion.div>
      <div>
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: accentLight, color: accent }}
        >
          {tab.badge}
        </motion.span>
        <p className="font-extrabold text-foreground text-base leading-tight mt-0.5">
          {tab.label}
        </p>
      </div>
      {articleCount != null && articleCount > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-auto text-xs text-muted-foreground"
        >
          {articleCount} articles
        </motion.span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const [activeTab, setActiveTab]   = useState("all");
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [now]                       = useState(() => new Date().getTime());

  const currentTab = TABS.find((t) => t.id === activeTab);

  const fetchNews = useCallback(async (category) => {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetch(`/api/news?category=${category}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setArticles(data.articles);
    } catch {
      setError(true);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab, fetchNews]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setArticles([]);
  };

  const featured  = articles[0] || null;
  const rest      = articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
        <Header></Header>
      <PageBanner />

      <div className="max-w-5xl mx-auto px-4 -mt-10 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card border border-border rounded-3xl shadow-2xl shadow-black/10 overflow-hidden"
        >
          {/* ── Tab bar ── */}
          <div className="bg-muted/20 border-b border-border px-4 sm:px-6 py-3 overflow-x-auto">
            <div className="flex gap-1 min-w-max sm:min-w-0">
              {TABS.map((tab, i) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  index={i}
                />
              ))}

              {/* Refresh button */}
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.35 }}
                onClick={() => fetchNews(activeTab)}
                disabled={loading}
                className="ml-auto flex items-center justify-center w-10 h-10 rounded-xl
                  text-muted-foreground hover:text-foreground hover:bg-muted/40
                  transition-colors disabled:opacity-40"
              >
                <RefreshCw size={15} />
              </motion.button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-5 sm:p-7 min-h-[520px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Section label */}
                <SectionHeader tab={currentTab} articleCount={!loading ? articles.length : null} />

                {/* Divider wipe */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px bg-border mb-6 origin-left"
                />

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} index={i} />
                    ))
                  ) : error ? (
                    <ErrorState onRetry={() => fetchNews(activeTab)} />
                  ) : articles.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full py-16 flex flex-col items-center gap-3 text-center"
                    >
                      <span className="text-4xl">📰</span>
                      <p className="font-bold text-foreground">No articles found</p>
                      <p className="text-sm text-muted-foreground">Try refreshing or switching categories</p>
                    </motion.div>
                  ) : (
                    <>
                      {featured && (
                        <FeaturedCard
                          article={featured}
                          tab={currentTab}
                          now={now}
                        />
                      )}
                      {rest.map((article, i) => (
                        <NewsCard
                          key={`${activeTab}-${article.id}-${i}`}
                          article={article}
                          index={i}
                          tab={currentTab}
                          now={now}
                        />
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-5
            flex items-center justify-center gap-1.5"
        >
          <Sprout size={12} className="text-primary" />
          News sourced from Google News RSS · refreshes every 15 minutes
        </motion.p>
      </div>
    </div>
  );
}