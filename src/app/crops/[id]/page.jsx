"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  MapPin,
  Package,
  Calendar,
  User,
  MessageCircle,
  Star,
  ChevronLeft,
  Share2,
  Zap,
  CheckCircle,
  Leaf,
  Droplets,
  Wind,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import SproutSpinner from "@/components/ui/SproutSpinner";

const FONT = { fontFamily: "'Josefin Sans', sans-serif" };

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function StarRow({ count = 4, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < count
              ? "fill-[#c8a227] text-[#c8a227]"
              : "fill-[#e8e2d6] text-[#e8e2d6]"
          }
        />
      ))}
    </div>
  );
}

function WidgetHead({ children }) {
  return (
    <div className="flex items-center gap-2 bg-[#2d5a1b] px-4 py-2.5 rounded-t-lg">
      <span className="w-2 h-2 rounded-full bg-[#f0c040] flex-shrink-0" />
      <span className="text-white text-[11px] font-bold uppercase tracking-[0.12em]" style={FONT}>
        {children}
      </span>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value, accent = "green" }) {
  const colors = {
    green:  { bg: "bg-[#eef4e6]", text: "text-[#2d5a1b]", icon: "text-[#4a7c2f]" },
    gold:   { bg: "bg-[#fdf3dc]", text: "text-[#7a5e10]", icon: "text-[#c8a227]" },
    blue:   { bg: "bg-[#e6f1fb]", text: "text-[#0c447c]", icon: "text-[#378add]" },
    purple: { bg: "bg-[#eeebfe]", text: "text-[#4a3ab0]", icon: "text-[#7f77dd]" },
  };
  const c = colors[accent];
  return (
    <div className={`flex items-center gap-3 p-3 ${c.bg} rounded-lg border border-white/60`}>
      <Icon size={18} className={`${c.icon} flex-shrink-0`} />
      <div>
        <p className="text-[10px] text-[#6b7a5e] uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-[13px] font-bold ${c.text}`} style={FONT}>{value}</p>
      </div>
    </div>
  );
}

function TabDescription({ crop }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <p className="text-[14px] text-[#4a5c3a] leading-relaxed">
        {crop.description || "No description provided for this crop."}
      </p>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <InfoChip icon={Package}  label="Crop Type" value={crop.cropType || crop.category || "—"} accent="green" />
        <InfoChip icon={Package}  label="Unit"      value={crop.unit || "kg"}                     accent="blue" />
        <InfoChip icon={Calendar} label="Listed"
          value={crop.createdAt
            ? new Date(crop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : "—"}
          accent="purple"
        />
        <InfoChip icon={Zap} label="Status" value={crop.status || "Available"} accent="gold" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#dde4d0]">
        {[
          { icon: Leaf,     label: "Soil",   value: crop.soil   || "Loamy"  },
          { icon: Droplets, label: "Water",  value: crop.water  || "Medium" },
          { icon: Wind,     label: "Season", value: crop.season || "Winter" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-[#f7f5ef] rounded-lg border border-[#dde4d0] text-center">
            <Icon size={18} className="text-[#4a7c2f]" />
            <p className="text-[10px] text-[#6b7a5e] uppercase tracking-wider">{label}</p>
            <p className="text-[12px] font-bold text-[#2d3a1e]" style={FONT}>{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TabFarmer({ farmerInfo }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-[#2d5a1b] rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#c8a227]">
          <User size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-[16px] font-bold text-[#2d3a1e]" style={FONT}>{farmerInfo.name}</h3>
          <p className="flex items-center gap-1 text-[12px] text-[#6b7a5e] mt-1">
            <MapPin size={12} /> {farmerInfo.location}
          </p>
          <p className="text-[12px] text-[#6b7a5e] mt-1">{farmerInfo.experience} yrs experience</p>
          <StarRow count={5} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#dde4d0]">
        {[["42","Crops"],["4.8","Rating"],["1.2K","Buyers"]].map(([n, l]) => (
          <div key={l} className="text-center">
            <p className="text-[20px] font-bold text-[#4a7c2f]" style={FONT}>{n}</p>
            <p className="text-[11px] text-[#6b7a5e] uppercase tracking-wide">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2d5a1b] hover:bg-[#4a7c2f] text-white text-[12px] font-bold rounded-md transition-colors uppercase tracking-wide" style={FONT}>
          <MessageCircle size={14} /> Chat
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-[#dde4d0] hover:border-[#4a7c2f] text-[#2d3a1e] text-[12px] font-bold rounded-md transition-colors uppercase tracking-wide" style={FONT}>
          <User size={14} /> Profile
        </button>
      </div>
    </motion.div>
  );
}

function TabReviews({ reviews }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {reviews.map((review, i) => (
        <div key={i} className="p-4 bg-[#f7f5ef] border border-[#dde4d0] rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[13px] font-bold text-[#2d3a1e]" style={FONT}>{review.user}</p>
              <StarRow count={review.rating} />
            </div>
            <p className="text-[11px] text-[#6b7a5e]">{review.date}</p>
          </div>
          <p className="text-[13px] text-[#4a5c3a] leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function CropDetailsPage() {
  const params  = useParams();
  const router  = useRouter();

  const [crop,      setCrop]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [isLiked,   setIsLiked]   = useState(false);
  const [quantity,  setQuantity]  = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [imgError,  setImgError]  = useState(false);

  // ── Payment state ────────────────────────────────────────────────────────
  const [payLoading, setPayLoading] = useState(false);
  const [payError,   setPayError]   = useState(null);

  const farmerInfo = {
    name: "Ahmed Hassan",
    location: "Dhaka, Bangladesh",
    experience: 15,
  };

  const reviews = [
    { user: "Karim Khan",    rating: 5, comment: "Excellent quality! Fresh and delivered on time.", date: "2 weeks ago" },
    { user: "Fatima Begum",  rating: 4, comment: "Good product. Packaging could be better.",        date: "1 month ago" },
    { user: "Roni Ahmed",    rating: 5, comment: "Best crop I've bought. Will order again!",        date: "1 month ago" },
  ];

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res    = await fetch(`/api/crops/${params.id}`);
        const result = await res.json();
        if (result.success) setCrop(result.data);
      } catch (err) {
        console.error("Error fetching crop:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [params.id]);

  // ── Buy Now — SSLCommerz ─────────────────────────────────────────────────
  const handleBuyNow = async () => {
    setPayError(null);
    setPayLoading(true);

    try {
      // 1️⃣  Create an order first so we have an orderId to link the payment
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // TODO: replace with real auth user IDs from your useCurrentUser hook
          buyerId:  "BUYER_ID_FROM_AUTH",
          farmerId: crop.farmerId || "FARMER_ID",
          cropId:   crop._id,
          quantity,
          price:    Number(crop.price) * quantity,
        }),
      });

      const orderResult = await orderRes.json();
      if (!orderResult.success) throw new Error(orderResult.message || "Failed to create order");

      const orderId = orderResult.data._id;

      // 2️⃣  Initiate SSLCommerz payment
      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          cropId:       crop._id,
          cropTitle:    crop.title,
          cropCategory: crop.category || "Agriculture",
          quantity,
          amount:       Number(crop.price) * quantity,

          // TODO: replace with real buyer info from your useCurrentUser hook
          customer: {
            name:     "Buyer Name",
            email:    "buyer@example.com",
            phone:    "01700000000",
            address:  "Dhaka",
            city:     "Dhaka",
            postcode: "1000",
          },
        }),
      });

      const payResult = await payRes.json();
      if (!payResult.success) throw new Error(payResult.error || "Payment initiation failed");

      // 3️⃣  Redirect to SSLCommerz gateway
      window.location.href = payResult.gatewayURL;
    } catch (err) {
      console.error("Payment error:", err);
      setPayError(err.message || "Something went wrong. Please try again.");
      setPayLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f5ef]">
        <SproutSpinner size={56} />
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (!crop) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🌾</span>
          <h1 className="text-2xl font-bold text-[#2d3a1e] mb-4" style={FONT}>Crop Not Found</h1>
          <Link
            href="/crops"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2d5a1b] hover:bg-[#4a7c2f] text-white text-sm font-bold rounded-md transition-colors uppercase tracking-wide"
            style={FONT}
          >
            <ChevronLeft size={16} /> Back to Crops
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = (Number(crop.price) * quantity).toLocaleString();
  const tabs = ["description", "farmer", "reviews"];

  return (
    <div className="min-h-screen bg-[#f7f5ef]">

      {/* ── HERO BANNER ────────────────────────────────────────────────── */}
      <div className="relative bg-[#1e3a0f] overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url('/images/crops1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(20,45,10,0.92), rgba(45,90,27,0.75), rgba(20,45,10,0.6))" }} />
        <span className="absolute right-8 bottom-0 text-[110px] opacity-10 select-none leading-none">🌾</span>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20 flex items-end justify-between">
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-wide" style={FONT}>{crop.title}</h1>
          <div className="hidden md:flex flex-col items-end gap-2">
            {crop.category && (
              <span className="px-3 py-1.5 bg-[#2d5a1b] text-white text-[11px] font-bold uppercase tracking-widest rounded border border-white/10" style={FONT}>{crop.category}</span>
            )}
            <span className="px-3 py-1.5 bg-[#c8a227] text-white text-[11px] font-bold uppercase tracking-widest rounded" style={FONT}>{crop.status || "Available"}</span>
          </div>
        </div>
      </div>

      {/* ── STICKY BACK BAR ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#dde4d0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
          <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }} onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[#2d5a1b] hover:text-[#4a7c2f] text-[13px] font-bold transition-colors" style={FONT}
          >
            <ChevronLeft size={18} /> Back to Crops
          </motion.button>
          <span className="text-[#dde4d0]">|</span>
          <p className="text-[13px] text-[#6b7a5e] truncate">{crop.title}</p>
          <div className="ml-auto flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-md border border-[#dde4d0] bg-white hover:border-[#4a7c2f] transition-colors"
            >
              <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-[#6b7a5e]"} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-md border border-[#dde4d0] bg-white hover:border-[#4a7c2f] transition-colors">
              <Share2 size={16} className="text-[#6b7a5e]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── LEFT ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero image */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              className="relative h-72 sm:h-96 rounded-xl overflow-hidden border border-[#dde4d0] group bg-[#eef4e6]"
            >
              {!imgError ? (
                <img src={crop.image || crop.imageUrl || "/placeholder-crop.jpg"} alt={crop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-30">🌾</div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, rgba(20,45,10,0.6), transparent)" }} />
              {crop.category && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#2d5a1b] text-white text-[10px] font-bold uppercase tracking-widest rounded" style={FONT}>{crop.category}</span>
              )}
              <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center border border-[#dde4d0]"
              >
                <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-[#6b7a5e]"} />
              </motion.button>
              <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#c8a227] text-white text-[10px] font-bold uppercase tracking-widest rounded" style={FONT}>
                {crop.status || "Available"}
              </span>
            </motion.div>

            {/* Info chips */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <InfoChip icon={MapPin}   label="Location"  value={crop.location || "—"}                        accent="green"  />
              <InfoChip icon={Package}  label="Available" value={`${crop.quantity ?? "—"} ${crop.unit || "kg"}`} accent="blue"   />
              <InfoChip icon={Star}     label="Rating"    value="4.8 / 5"                                     accent="gold"   />
              <InfoChip icon={Calendar} label="Listed"
                value={crop.createdAt ? new Date(crop.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}
                accent="purple"
              />
            </motion.div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}
              className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden"
            >
              <div className="flex border-b border-[#dde4d0] bg-[#f7f5ef]">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-wider capitalize transition-all
                      ${activeTab === tab ? "border-b-2 border-[#2d5a1b] text-[#2d5a1b] bg-white" : "text-[#6b7a5e] hover:text-[#2d3a1e]"}`}
                    style={FONT}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && <TabDescription key="desc"    crop={crop}           />}
                  {activeTab === "farmer"      && <TabFarmer      key="farmer"  farmerInfo={farmerInfo} />}
                  {activeTab === "reviews"     && <TabReviews     key="reviews" reviews={reviews}      />}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: price card ──────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.45 }}
              className="sticky top-20 space-y-4"
            >
              {/* Price widget */}
              <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
                <WidgetHead>Pricing</WidgetHead>
                <div className="p-5">
                  <p className="text-[11px] text-[#6b7a5e] uppercase tracking-wider mb-1">Price per {crop.unit || "kg"}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[32px] font-bold text-[#4a7c2f] leading-none" style={FONT}>
                      Tk {Number(crop.price).toLocaleString()}
                    </span>
                    {crop.oldPrice && (
                      <span className="text-[14px] text-[#aaa] line-through">Tk {Number(crop.oldPrice).toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6b7a5e]">+ shipping charges apply</p>

                  <div className="mt-5 pt-5 border-t border-[#dde4d0] space-y-4">
                    {/* Quantity */}
                    <div>
                      <p className="text-[11px] text-[#6b7a5e] uppercase tracking-wider mb-2">Quantity</p>
                      <div className="flex items-center gap-0 border border-[#dde4d0] rounded-md overflow-hidden bg-[#f7f5ef]">
                        <button onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                          className="w-10 h-10 flex items-center justify-center text-[#2d5a1b] font-bold hover:bg-[#dde4d0] transition-colors text-lg flex-shrink-0"
                        >−</button>
                        <input type="number" value={quantity} min={1} max={crop.quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 text-center text-[14px] font-bold text-[#2d3a1e] bg-transparent outline-none py-2"
                          style={FONT}
                        />
                        <button onClick={() => setQuantity((q) => q + 1)}
                          className="w-10 h-10 flex items-center justify-center text-[#2d5a1b] font-bold hover:bg-[#dde4d0] transition-colors text-lg flex-shrink-0"
                        >+</button>
                      </div>
                      <p className="text-[11px] text-[#6b7a5e] mt-1">Max: {crop.quantity ?? "—"} {crop.unit || "kg"}</p>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#dde4d0]">
                      <p className="text-[12px] text-[#6b7a5e] uppercase tracking-wide">Total</p>
                      <span className="text-[22px] font-bold text-[#4a7c2f]" style={FONT}>Tk {totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Error message ───────────────────────────────────── */}
              {payError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px]"
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {payError}
                </motion.div>
              )}

              {/* ── Action buttons ──────────────────────────────────── */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#2d5a1b] hover:bg-[#4a7c2f]
                           text-white text-[13px] font-bold rounded-lg transition-colors uppercase tracking-wide shadow-md"
                style={FONT}
              >
                <ShoppingCart size={17} /> Add to Cart
              </motion.button>

              {/* ── BUY NOW — triggers SSLCommerz ──────────────────── */}
              <motion.button
                whileHover={{ scale: payLoading ? 1 : 1.02 }}
                whileTap={{ scale: payLoading ? 1 : 0.97 }}
                onClick={handleBuyNow}
                disabled={payLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#c8a227] hover:bg-[#d4ad30]
                           text-white text-[13px] font-bold rounded-lg transition-colors uppercase tracking-wide
                           disabled:opacity-70 disabled:cursor-not-allowed"
                style={FONT}
              >
                {payLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Redirecting to Payment…
                  </>
                ) : (
                  <>
                    <Zap size={17} /> Buy Now · Tk {totalPrice}
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border border-[#dde4d0]
                           hover:border-[#4a7c2f] text-[#2d3a1e] text-[13px] font-bold rounded-lg transition-colors uppercase tracking-wide"
                style={FONT}
              >
                <MessageCircle size={17} /> Message Farmer
              </motion.button>

              {/* Trust badges */}
              <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
                <WidgetHead>Why Buy Here</WidgetHead>
                <div className="p-4 space-y-2.5">
                  {[
                    "Fresh directly from farm",
                    "Free shipping over Tk 500",
                    "30-day quality guarantee",
                    "Secure payment via SSLCommerz",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-2.5 text-[12px] text-[#4a5c3a]">
                      <CheckCircle size={14} className="text-[#4a7c2f] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-white border border-[#dde4d0] rounded-lg overflow-hidden">
                <WidgetHead>Contact Info</WidgetHead>
                <div className="p-4 space-y-2">
                  {[
                    { icon: MapPin,        text: "Dhaka, Bangladesh"    },
                    { icon: MessageCircle, text: "+880 199-000-0000" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-[12px] text-[#6b7a5e]">
                      <Icon size={13} className="text-[#4a7c2f] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}