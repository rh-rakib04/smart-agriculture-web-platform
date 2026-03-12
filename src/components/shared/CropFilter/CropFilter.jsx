"use client";

import { motion } from "framer-motion";
import { Cloud, Droplets, Leaf, X } from "lucide-react";

const FilterSelect = ({ icon: Icon, label, value, onChange, options }) => {
  return (
    <div className="mb-6">
      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-3">
        <Icon size={16} className="text-green-600" />
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700 text-sm font-medium transition-all duration-200 hover:border-green-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 cursor-pointer"
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default function CropFilter({ filters, setFilters }) {
  const hasActiveFilters = Object.values(filters).some((f) => f !== "");

  const handleReset = () => {
    setFilters({});
  };

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
              className="w-full sm:w-72 min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 border-r border-gray-200 shadow-lg p-4 sm:p-8 sticky top-24 z-30 overflow-y-auto"
    >
      {/* Header */}
      <div className="mb-8 mt-10">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Smart Filters
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">Refine your crop search</p>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <FilterSelect
          icon={Cloud}
          label="Season"
          value={filters.season || ""}
          onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          options={["Winter", "Summer", "Monsoon"]}
        />

        <FilterSelect
          icon={Leaf}
          label="Soil Type"
          value={filters.soil || ""}
          onChange={(e) => setFilters({ ...filters, soil: e.target.value })}
          options={["Loamy", "Clay", "Sandy"]}
        />

        <FilterSelect
          icon={Droplets}
          label="Water Need"
          value={filters.water || ""}
          onChange={(e) => setFilters({ ...filters, water: e.target.value })}
          options={["Low", "Medium", "High"]}
        />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleReset}
          className="w-full mt-8 py-2 sm:py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
          Clear Filters
        </motion.button>
      )}

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 p-3 sm:p-4 bg-green-100 border border-green-200 rounded-lg"
      >
        <p className="text-xs text-green-800 font-medium">
          💡 Combine filters to find the perfect crops for your farm conditions.
        </p>
      </motion.div>
    </motion.div>
  );
}