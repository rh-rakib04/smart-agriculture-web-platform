"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Droplets, Leaf, X, SlidersHorizontal, Tag } from "lucide-react";

// ── Agrezen-styled select ─────────────────────────────────────────────────────
function FilterSelect({ icon: Icon, label, value, onChange, options }) {
  return (
    <div className="mb-1">
      <label
        className="flex items-center gap-2 text-[11px] font-bold text-[#6b7a5e] uppercase tracking-[0.1em] mb-2"
      >
        <Icon size={13} className="text-[#4a7c2f]" />
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2.5 border border-[#dde4d0] rounded-md bg-[#f7f5ef] text-[#2a2a2a] text-[13px] font-medium
                   hover:border-[#4a7c2f] focus:outline-none focus:border-[#4a7c2f] focus:ring-2 focus:ring-[#4a7c2f]/20
                   cursor-pointer transition-all duration-150"
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ── Category pill list ────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "",           label: "All Products" },
  { value: "grain",      label: "Grain" },
  { value: "vegetable",  label: "Vegetable" },
  { value: "fruit",      label: "Fruit" },
  { value: "legume",     label: "Legume" },
  { value: "herb",       label: "Herb" },
];

export default function CropFilter({ filters, setFilters }) {
  const hasActiveFilters = Object.values(filters).some((f) => f && f !== "");

  const setFilter = (key, val) => setFilters({ ...filters, [key]: val });
  const handleReset = () => setFilters({});

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-56 flex-shrink-0 flex flex-col gap-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
    >

      {/* ── Search widget ────────────────────────────────────────────── */}
      <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
        <div className="bg-[#2d5a1b] px-4 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f0c040] flex-shrink-0" />
          <span
            className="text-white text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Search
          </span>
        </div>
        <div className="p-3">
          <div className="flex gap-0">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search crops…"
              className="flex-1 text-[13px] px-3 py-2 border border-[#dde4d0] border-r-0 rounded-l-md bg-[#f7f5ef] text-[#2a2a2a]
                         focus:outline-none focus:border-[#4a7c2f] transition-colors"
            />
            <button className="px-3 bg-[#4a7c2f] text-white rounded-r-md text-sm hover:bg-[#2d5a1b] transition-colors">
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* ── Category widget ──────────────────────────────────────────── */}
      <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
        <div className="bg-[#2d5a1b] px-4 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f0c040] flex-shrink-0" />
          <span
            className="text-white text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Product Category
          </span>
        </div>
        <ul className="p-3 space-y-0.5">
          {CATEGORIES.map(({ value, label }) => {
            const active = (filters.category || "") === value;
            return (
              <li key={value}>
                <button
                  onClick={() => setFilter("category", value)}
                  className={`w-full flex items-center justify-between text-[13px] px-2 py-1.5 rounded text-left transition-all
                    ${active
                      ? "text-[#4a7c2f] font-bold"
                      : "text-[#6b7a5e] hover:text-[#4a7c2f] font-medium"
                    }`}
                >
                  <span>{label}</span>
                  {active && (
                    <span className="text-[10px] bg-[#2d5a1b] text-white px-2 py-0.5 rounded-full font-bold">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Smart Filters widget ─────────────────────────────────────── */}
      <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
        <div className="bg-[#2d5a1b] px-4 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f0c040] flex-shrink-0" />
          <span
            className="text-white text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Smart Filters
          </span>
        </div>
        <div className="p-3 space-y-4">
          <FilterSelect
            icon={Cloud}
            label="Season"
            value={filters.season || ""}
            onChange={(e) => setFilter("season", e.target.value)}
            options={["Winter", "Summer", "Monsoon"]}
          />
          <FilterSelect
            icon={Leaf}
            label="Soil Type"
            value={filters.soil || ""}
            onChange={(e) => setFilter("soil", e.target.value)}
            options={["Loamy", "Clay", "Sandy"]}
          />
          <FilterSelect
            icon={Droplets}
            label="Water Need"
            value={filters.water || ""}
            onChange={(e) => setFilter("water", e.target.value)}
            options={["Low", "Medium", "High"]}
          />
        </div>
      </div>

      {/* ── Price Range widget ───────────────────────────────────────── */}
      <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
        <div className="bg-[#2d5a1b] px-4 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f0c040] flex-shrink-0" />
          <span
            className="text-white text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Price Range
          </span>
        </div>
        <div className="p-3">
          <p className="text-[11px] text-[#6b7a5e] uppercase tracking-[0.08em] mb-2">
            Max price per kg
          </p>
          <input
            type="range"
            min={1}
            max={2000}
            step={10}
            value={filters.maxPrice || 2000}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className="w-full accent-[#4a7c2f]"
          />
          <div className="flex justify-between text-[11px] text-[#6b7a5e] mt-1"
               style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <span>Tk 1</span>
            <span>Tk {Number(filters.maxPrice || 2000).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Reset button ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                       border border-[#dde4d0] bg-white text-[#2d5a1b] rounded-lg
                       text-[11px] font-bold uppercase tracking-widest
                       hover:bg-[#eef4e6] hover:border-[#4a7c2f] transition-all group"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            <X size={14} className="group-hover:rotate-90 transition-transform duration-200" />
            Clear All Filters
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Tip box ──────────────────────────────────────────────────── */}
      <div className="bg-[#eef4e6] border border-[#c5d9a8] rounded-lg p-3">
        <p className="text-[11px] text-[#2d5a1b] font-medium leading-relaxed">
          💡 Combine filters to find the perfect crops for your farm conditions.
        </p>
      </div>

    </motion.aside>
  );
}