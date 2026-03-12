"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CropFilter from "@/components/shared/CropFilter/CropFilter";
import CropCard from "@/components/shared/CropCard/cropcard";

export default function CropsPage() {

  const [filters, setFilters] = useState({});
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch crops from backend
  const fetchCrops = async (filters = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const res = await fetch(`/api/crops?${params.toString()}`);

      const data = await res.json();

      if (data.success) {
        setCrops(data.data);
      }

    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page loads or filters change
  useEffect(() => {
    fetchCrops(filters);
  }, [filters]);

  const activeFilterCount = Object.values(filters).filter((f) => f !== "").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">

      {/* Sidebar Filter */}
      <div className="hidden lg:block">
        <CropFilter filters={filters} setFilters={setFilters} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full pt-16 lg:pt-20 z-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Crop Catalog
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {crops.length} crop{crops.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {activeFilterCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-green-100 text-green-700 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap"
              >
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </motion.div>
            )}

          </div>
        </motion.div>

        {/* Crops Grid */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">

          <AnimatePresence mode="wait">

            {crops.length > 0 ? (

              <motion.div
                key="crops-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 auto-rows-fr"
              >

                {crops.map((crop) => (
                  <motion.div key={crop._id} variants={itemVariants}>
                    <CropCard crop={crop} />
                  </motion.div>
                ))}

              </motion.div>

            ) : (

              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center min-h-80 sm:min-h-96 text-center px-4"
              >

                <div className="text-5xl sm:text-6xl mb-4">🌾</div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  No crops found
                </h3>

                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-sm">
                  Try adjusting your filters to see more crops
                </p>

                <button
                  onClick={() => setFilters({})}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm sm:text-base rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Clear Filters
                </button>

              </motion.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}