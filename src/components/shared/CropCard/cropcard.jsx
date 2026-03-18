"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Eye, MapPin, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

function StarRating({ count = 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          className={i < count ? "fill-[#c8a227] text-[#c8a227]" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function CropCard({ crop }) {
  const [isLiked, setIsLiked] = useState(false);

  // Derive a fake "old price" for sale display when not provided by backend
  const hasDiscount = crop.oldPrice && crop.oldPrice > crop.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-xl overflow-hidden border border-[#dde4d0] hover:border-[#6aaa3a] hover:shadow-lg transition-all duration-250 flex flex-col h-full"
    >

      {/* ── IMAGE ──────────────────────────────────────────────────────── */}
      <div className="relative h-44 bg-gradient-to-br from-[#eef4e6] to-[#deecd0] overflow-hidden flex items-center justify-center">

        <img
          src={crop.image || crop.imageUrl || "/placeholder-crop.jpg"}
          alt={crop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Fallback emoji shown when no real image */}
        <span className="absolute text-7xl opacity-30 select-none pointer-events-none">🌾</span>

        {/* Sale badge */}
        {hasDiscount && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded bg-[#c8a227]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Sale
          </span>
        )}

        {/* New / category badge */}
        {!hasDiscount && crop.category && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded bg-[#2d5a1b]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            {crop.category}
          </span>
        )}

        {/* Organic badge */}
        {crop.organic && (
          <span
            className="absolute top-3 right-12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2d5a1b] rounded bg-[#a8c66c]"
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          >
            Organic
          </span>
        )}

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center border border-[#dde4d0]"
        >
          <Heart
            size={15}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </motion.button>

        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-[#2d5a1b]/75 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link href={`/crops/${crop._id}`}>
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#2d5a1b] text-xs font-bold uppercase tracking-wide rounded hover:bg-[#f0c040] hover:text-white transition-colors"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              <Eye size={13} />
              Details
            </button>
          </Link>
          <Link href={`/crops/${crop._id}`}>
            <button
              className="flex items-center gap-1.5 px-3 py-2 bg-[#c8a227] text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-[#f0c040] transition-colors"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              <ShoppingCart size={13} />
              Buy
            </button>
          </Link>
        </div>

      </div>

      {/* ── BODY ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 border-t border-[#eef2e6]">

        {/* Name */}
        <h3
          className="text-[15px] font-bold text-[#2a2a2a] group-hover:text-[#4a7c2f] transition-colors mb-1 leading-snug line-clamp-2"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          {crop.title}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-[11px] text-[#6b7a5e] mb-2">
          <MapPin size={11} />
          {crop.location || "Unknown location"}
        </p>

        {/* Stars */}
        <div className="mb-3">
          <StarRating count={crop.stars || 4} />
        </div>

        {/* Divider */}
        <div className="h-px bg-[#eef2e6] mb-3" />

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-[12px] text-gray-400 line-through">
                Tk {Number(crop.oldPrice).toFixed(2)}
              </span>
            )}
            <span
              className="text-[17px] font-bold text-[#4a7c2f]"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              Tk {Number(crop.price).toFixed(2)}
              <span className="text-[11px] font-normal text-[#6b7a5e]">/{crop.unit || "kg"}</span>
            </span>
          </div>

          {/* Category pill (when not shown as badge) */}
          {hasDiscount && crop.category && (
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full
              ${crop.category === "grain"     ? "bg-[#fdf3dc] text-[#7a5e10]" : ""}
              ${crop.category === "vegetable" ? "bg-[#eef4e6] text-[#2d6010]" : ""}
              ${crop.category === "fruit"     ? "bg-[#fdeee6] text-[#8a3c1a]" : ""}
              ${crop.category === "legume"    ? "bg-[#eeebfe] text-[#4a3ab0]" : ""}
              ${crop.category === "herb"      ? "bg-[#e6f5f0] text-[#0f6e4a]" : ""}
              ${"bg-[#eef4e6] text-[#2d6010]"}
            `}>
              {crop.category}
            </span>
          )}
        </div>

      </div>

    </motion.div>
  );
}