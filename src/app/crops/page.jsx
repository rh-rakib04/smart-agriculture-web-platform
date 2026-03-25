"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CropFilter from "@/components/shared/CropFilter/CropFilter";
import CropCard from "@/components/shared/CropCard/cropcard";
import SproutSpinner from "@/components/ui/SproutSpinner";

const PER_PAGE = 9;

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function CropsPage() {
  // ── Fetch ALL crops once on mount — never re-fetch on filter change ───────
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/crops");
        const data = await res.json();
        if (data.success) setAllCrops(data.data);
      } catch (err) {
        console.error("Error fetching crops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // empty — runs once only, no reload on filter change

  // ── Separate search state (debounced) vs sidebar filters ─────────────────
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on any filter/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters, sortBy]);

  // ── Pure client-side filter + sort (instant, zero network) ───────────────
  const filtered = useMemo(() => {
    let list = [...allCrops];

    // debounced search across name, category, location
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(q) ||
          (c.category || "").toLowerCase().includes(q) ||
          (c.location || "").toLowerCase().includes(q),
      );
    }

    if (filters.category) {
      list = list.filter(
        (c) =>
          (c.category || "").toLowerCase() === filters.category.toLowerCase(),
      );
    }
    if (filters.location) {
      list = list.filter((c) =>
        (c.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase()),
      );
    }
    if (filters.season) {
      list = list.filter(
        (c) => (c.season || "").toLowerCase() === filters.season.toLowerCase(),
      );
    }
    if (filters.soil) {
      list = list.filter(
        (c) => (c.soil || "").toLowerCase() === filters.soil.toLowerCase(),
      );
    }
    if (filters.water) {
      list = list.filter(
        (c) => (c.water || "").toLowerCase() === filters.water.toLowerCase(),
      );
    }
    if (filters.minPrice) {
      list = list.filter((c) => Number(c.price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      list = list.filter((c) => Number(c.price) <= Number(filters.maxPrice));
    }

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name")
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return list;
  }, [allCrops, debouncedSearch, filters, sortBy]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PER_PAGE;
  const pageCrops = filtered.slice(pageStart, pageStart + PER_PAGE);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((f) => f && f !== "").length,
    [filters],
  );

  const resetAll = useCallback(() => {
    setFilters({});
    setSearchInput("");
    setSortBy("default");
    setCurrentPage(1);
  }, []);

  // // ── Loading ───────────────────────────────────────────────────────────────
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <SproutSpinner size={56} />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#f7f5ef] font-sans">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#1e3a0f] overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/images/crops1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(30,58,15,0.90), rgba(45,90,27,0.70), rgba(30,58,15,0.50))",
          }}
        />
        <span className="absolute right-10 bottom-0 text-[140px] opacity-10 select-none leading-none">
          🚜
        </span>
        <div className="relative z-10 flex items-end justify-between px-6 lg:px-10 py-18 max-w-7xl mx-auto">
          <h1
            className="text-4xl lg:text-5xl font-bold text-white tracking-wide mt-10"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Crops
          </h1>
          <div className="hidden md:flex gap-4">
            {[
              { n: allCrops.length, l: "Listed" },
              {
                n: [...new Set(allCrops.map((c) => c.category))].filter(Boolean)
                  .length,
                l: "Categories",
              },
              {
                n: [...new Set(allCrops.map((c) => c.location))].filter(Boolean)
                  .length,
                l: "Regions",
              },
            ].map(({ n, l }) => (
              <div
                key={l}
                className="text-center bg-white/10 border border-white/20 rounded-lg px-5 py-3 backdrop-blur-sm"
              >
                <span
                  className="block text-2xl font-bold text-[#f0c040]"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  {n}
                </span>
                <span className="text-white/70 text-xs uppercase tracking-widest mt-1 block">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex max-w-7xl mx-auto px-4 lg:px-8 py-8 gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CropFilter filters={filters} setFilters={setFilters} />
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* ── Search bar ───────────────────────────────────────────────── */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a5e] pointer-events-none">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search crops by name, category or location…"
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-[#dde4d0] rounded-lg
                         text-[#2a2a2a] placeholder-[#aab49a]
                         focus:outline-none focus:border-[#4a7c2f] focus:ring-2 focus:ring-[#4a7c2f]/15
                         transition-all duration-200"
            />

            {/* live debounce indicator */}
            <AnimatePresence>
              {searchInput && searchInput !== debouncedSearch && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <SproutSpinner size={16} />
                </motion.span>
              )}
            </AnimatePresence>

            {/* clear × button */}
            <AnimatePresence>
              {searchInput && searchInput === debouncedSearch && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                             bg-[#dde4d0] text-[#6b7a5e] flex items-center justify-center
                             hover:bg-[#4a7c2f] hover:text-white transition-colors text-xs font-black"
                >
                  ×
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Active filter pills ───────────────────────────────────────── */}
          <AnimatePresence>
            {(activeFilterCount > 0 || debouncedSearch) && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden"
              >
                {debouncedSearch && (
                  <FilterPill
                    label={`"${debouncedSearch}"`}
                    onRemove={() => setSearchInput("")}
                  />
                )}
                {Object.entries(filters).map(([key, val]) =>
                  val ? (
                    <FilterPill
                      key={key}
                      label={`${key}: ${val}`}
                      onRemove={() =>
                        setFilters((prev) => ({ ...prev, [key]: "" }))
                      }
                    />
                  ) : null,
                )}
                <button
                  onClick={resetAll}
                  className="text-[11px] font-bold text-[#993c1d] uppercase tracking-wide
                             px-2.5 py-1 rounded-full border border-[#f5c4b3] bg-[#faece7]
                             hover:bg-[#f5c4b3] transition-colors"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Toolbar ───────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-white border border-[#dde4d0] rounded-lg px-4 py-3 mb-6">
            <p className="text-xs text-[#6b7a5e]">
              {filtered.length === 0
                ? "No results found"
                : `Showing ${pageStart + 1}–${Math.min(pageStart + PER_PAGE, filtered.length)} of ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-[#dde4d0] rounded-md px-3 py-2 bg-white
                         text-[#2a2a2a] focus:outline-none focus:border-[#4a7c2f] cursor-pointer"
            >
              <option value="default">Default sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Sort by name</option>
            </select>
          </div>

          {/* ── Grid ──────────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {pageCrops.length > 0 ? (
              <motion.div
                key={`${safePage}-${sortBy}-${debouncedSearch}-${JSON.stringify(filters)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {pageCrops.map((crop, i) => (
                  <motion.div
                    key={crop._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <CropCard crop={crop} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-80 bg-white
                           border border-[#dde4d0] rounded-xl text-center px-6 py-16"
              >
                <span className="text-6xl mb-4">🌾</span>
                <h3 className="text-lg font-bold text-[#2d3a1e] mb-2">
                  No crops found
                </h3>
                <p className="text-sm text-[#6b7a5e] mb-6 max-w-xs">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={resetAll}
                  className="px-6 py-2.5 bg-[#2d5a1b] hover:bg-[#4a7c2f] text-white text-sm
                             font-bold rounded-md transition-colors uppercase tracking-wide"
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Pagination ────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-md text-sm font-bold border transition-all
                    ${
                      safePage === p
                        ? "bg-[#2d5a1b] border-[#2d5a1b] text-white"
                        : "bg-white border-[#dde4d0] text-[#2d5a1b] hover:border-[#4a7c2f] hover:bg-[#eef4e6]"
                    }`}
                  style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                >
                  {p}
                </button>
              ))}
              {safePage < totalPages && (
                <button
                  onClick={() => setCurrentPage(safePage + 1)}
                  className="w-9 h-9 rounded-md text-sm font-bold border border-[#dde4d0]
                             bg-white text-[#2d5a1b] hover:border-[#4a7c2f] hover:bg-[#eef4e6] transition-all"
                >
                  →
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Active filter pill ────────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                 bg-[#eef4e6] border border-[#c5d9a8] text-[#2d5a1b]
                 text-[11px] font-bold"
    >
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full bg-[#c5d9a8] hover:bg-[#4a7c2f] hover:text-white
                   flex items-center justify-center text-[10px] transition-colors font-black leading-none"
      >
        ×
      </button>
    </motion.span>
  );
}
