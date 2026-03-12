"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  Droplet,
  Wind,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const TabContent = ({ activeTab, crop, farmerInfo, reviews }) => {
  switch (activeTab) {
    case "description":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{crop.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <SpecCard icon={Package} label="Type" value={crop.cropType} />
            <SpecCard icon={Package} label="Unit" value={crop.unit} />
            <SpecCard
              icon={Calendar}
              label="Listed"
              value={new Date(crop.createdAt).toLocaleDateString()}
            />
            <SpecCard icon={Zap} label="Status" value={crop.status} />
          </div>
        </motion.div>
      );

    case "farmer":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={40} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {farmerInfo.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {farmerInfo.location}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {farmerInfo.experience} years of farming experience
                </p>
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    <User size={18} />
                    Profile
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-200">
              <StatBox label="Crops Listed" value="42" />
              <StatBox label="Rating" value="4.8" />
              <StatBox label="Followers" value="1.2K" />
            </div>
          </div>
        </motion.div>
      );

    case "reviews":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{review.user}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={
                          j < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))}
        </motion.div>
      );

    default:
      return null;
  }
};

const SpecCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all">
    <div className="flex items-center gap-3">
      <Icon size={20} className="text-green-600 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="text-center">
    <p className="text-2xl font-bold text-green-600">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

export default function CropDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const farmerInfo = {
    name: "Ahmed Hassan Farmer",
    location: "Dhaka, Bangladesh",
    experience: 15,
  };

  const reviews = [
    {
      user: "Karim Khan",
      rating: 5,
      comment: "Excellent quality rice! Fresh and delivered on time.",
      date: "2 weeks ago",
    },
    {
      user: "Fatima Begum",
      rating: 4,
      comment: "Good product. Packaging could be better.",
      date: "1 month ago",
    },
    {
      user: "Roni Ahmed",
      rating: 5,
      comment: "Best rice I've ever bought. Will order again!",
      date: "1 month ago",
    },
  ];

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const response = await fetch(`/api/crops/${params.id}`);
        const result = await response.json();
        if (result.success) {
          setCrop(result.data);
        }
      } catch (error) {
        console.error("Error fetching crop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrop();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
        />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Crop Not Found
            </h1>
            <Link
              href="/crops"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
            >
              <ChevronLeft size={20} />
              Back to Crops
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="sticky top-16 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-900">{crop.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 shadow-xl group"
            >
              <img
                src={crop.image || crop.imageUrl || "/placeholder-crop.jpg"}
                alt={crop.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-full shadow-lg"
                >
                  {crop.category}
                </motion.div>
              </div>

              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <Heart
                  size={24}
                  className={
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }
                />
              </motion.button>

              {/* Status Badge */}
              <div className="absolute bottom-6 right-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 text-green-600 font-semibold rounded-full text-sm">
                  <Zap size={16} className="flex-shrink-0" />
                  {crop.status}
                </div>
              </div>
            </motion.div>

            {/* Key Details Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div
                whileHover={{ y: -4 }}
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {crop.location}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {crop.quantity} {crop.unit}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-semibold text-gray-900 text-sm">4.8/5</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Listed</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {new Date(crop.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                {["description", "farmer", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-4 font-semibold transition-all capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-green-600 text-green-600 bg-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <TabContent
                  activeTab={activeTab}
                  crop={crop}
                  farmerInfo={farmerInfo}
                  reviews={reviews}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 space-y-6"
            >
              {/* Price Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 shadow-xl">
                <p className="text-sm text-gray-600 mb-2">Price per {crop.unit}</p>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Tk {crop.price}
                </h2>
                <p className="text-xs text-gray-500">Plus shipping charges</p>

                <div className="mt-6 pt-6 border-t border-green-200 space-y-4">
                  {/* Quantity Selector */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Quantity
                    </p>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-2 border border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        −
                      </motion.button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, parseInt(e.target.value)))
                        }
                        className="flex-1 text-center font-semibold bg-transparent outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setQuantity(quantity + 1)
                        }
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        +
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Available: {crop.quantity} {crop.unit}
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="pt-4 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Total:</p>
                      <p className="text-2xl font-bold text-green-600">
                        Tk {(crop.price * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.button
                whileHover={{ scale: 1.02, }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all group"
              >
                <ShoppingCart
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all group"
              >
                <MessageCircle
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                Message Farmer
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all"
              >
                <Share2 size={20} />
                Share
              </motion.button>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-900 leading-relaxed">
                  ✓ Fresh from farm<br />
                  ✓ Free shipping on orders over Tk 500<br />
                  ✓ 30-day quality guarantee<br />
                  ✓ Secure payment
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
