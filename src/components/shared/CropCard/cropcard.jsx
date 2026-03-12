"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, MapPin, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";

const StatBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-100">
    <Icon size={14} />
    <span>{label}: {value}</span>
  </div>
);

export default function CropCard({ crop }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >

      {/* Image */}
      <div className="relative h-40 sm:h-56 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">

    <img
  src={crop.image || crop.imageUrl || "/placeholder-crop.jpg"}
  alt={crop.title}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
/>

        {/* Category Badge */}
        {crop.category && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
            {crop.category}
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white shadow-lg"
        >
          <Heart
            size={18}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </motion.button>

      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
          {crop.title}
        </h3>

        {/* Location */}
        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <MapPin size={14} />
          {crop.location || "Unknown location"}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-5">

          <StatBadge
            icon={Package}
            label="Quantity"
            value={`${crop.quantity} ${crop.unit}`}
          />

          <StatBadge
            icon={MapPin}
            label="Farmer"
            value={crop.farmerId}
          />

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

        {/* Price */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>

            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tk {crop.price}/{crop.unit}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">

          <Link href={`/crops/${crop._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-all"
            >
              <Eye size={16} />
              Details
            </motion.button>
          </Link>

          <Link href={`/crops/${crop._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart size={16} />
              Buy
            </motion.button>
          </Link>

        </div>

      </div>

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-500" />

    </motion.div>
  );
}