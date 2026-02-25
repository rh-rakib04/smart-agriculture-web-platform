'use client';

/**
 * HomePage - Comprehensive landing page showcasing the Smart Agriculture Platform
 * Features 10 main sections with information about all platform capabilities
 * With Framer Motion animations and interactive carousel
 */
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// Crop carousel data - defined outside component to prevent recreation on re-renders
// cropsData.js (create separate file)
const CROPS_DATA = [
  {
    name: "Wheat",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  },
  {
    name: "Corn",
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716",
  },
  {
    name: "Carrot",
    image: "https://images.unsplash.com/photo-1447175008436-170170d0e979",
  },
  {
    name: "Lettuce",
    image: "https://images.unsplash.com/photo-1582515073490-dc5b3a3d1f6d",
  },
  {
    name: "Tomato",
    image: "https://images.unsplash.com/photo-1592928302636-c83cf1cda3a0",
  },
];
export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentCrop, setCurrentCrop] = useState(0);
  const isFirstMount = useRef(true);

  // Auto-advance carousel - only updates carousel state, no full page re-render

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentCrop((prev) => (prev + 1) % CROPS_DATA.length);
  }, 5000);

  return () => clearInterval(timer);
}, []);

  // Section 1: Hero Section with Carousel
const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-white">

    {/* Background Auto-Changing Images */}
    <AnimatePresence mode="wait">
      <motion.div
        key={currentCrop}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <Image
          src={CROPS_DATA[currentCrop].image}
          alt="Agriculture Background"
          fill
          priority
          className="object-cover"
        />
      </motion.div>
    </AnimatePresence>

    {/* Dark Overlay for Readability */}
    <div className="absolute inset-0 bg-black/65" />

    {/* Center Content */}
    <div className="relative z-10 text-center px-6">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8"
      >
        SmartAgri Platform
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
      >
        Empowering farmers and buyers with modern AI-driven agriculture solutions.
      </motion.p>

      {/* Only Two Buttons */}
      <div className="flex flex-wrap justify-center gap-6">

        <Link
          href="/farmer"
          className="px-10 py-4 bg-white text-green-800 rounded-lg font-bold hover:bg-green-50 transition shadow-xl"
        >
          👨‍🌾 Farmer
        </Link>

        <Link
          href="/buyer"
          className="px-10 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-xl"
        >
          👨‍💼 Buyer
        </Link>

      </div>
    </div>
  </section>
);


  // Section 2: Farmer Dashboard Features
  const FarmerFeaturesSection = () => (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          🌱 Complete Farming Solutions for Farmers
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📊', title: 'Crop Management', desc: 'Track crops from planting to harvest with real-time health monitoring' },
            { icon: '💰', title: 'Expense & Profit Tracker', desc: 'Monitor all farm expenses and calculate profitability instantly' },
            { icon: '🤖', title: 'AI Recommendations', desc: 'Get intelligent farming suggestions and alerts based on data' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              onMouseEnter={() => setHoveredCard(`farmer-${idx}`)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <motion.div 
                className="text-4xl mb-4"
              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/farmer" className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition">
              Explore Farmer Dashboard →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );

  // Section 3: Buyer Dashboard Features
  const BuyerFeaturesSection = () => (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          🛍️ Smart Solutions for Buyers
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🌾', title: 'Fresh Crop Catalog', desc: 'Browse available crops directly from farmers with quality details' },
            { icon: '📈', title: 'Harvest Estimation', desc: 'View estimated yields and quality predictions for informed decisions' },
            { icon: '💬', title: 'Direct Messaging', desc: 'Communicate directly with farmers to negotiate and arrange purchases' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-blue-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              onMouseEnter={() => setHoveredCard(`buyer-${idx}`)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
            >
              <motion.div 
                className="text-4xl mb-4"

              >
                {item.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/buyer" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Explore Buyer Dashboard →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );

  // Section 4: Student & Learning Module
  const StudentModuleSection = () => (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-yellow-50">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          📚 Educational Resources for Students
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-5xl mb-6">👨‍🎓</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Learn Modern Agriculture</h3>
            <p className="text-gray-700 mb-6">
              Access comprehensive educational content including:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Real-time market data and crop prices</li>
              <li>✓ Market analytics and demand trends</li>
              <li>✓ Seasonal pattern analysis</li>
              <li>✓ Interactive learning resources</li>
              <li>✓ Industry best practices</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg p-8 text-white">
              <p className="text-lg font-semibold mb-4">
                📊 Stay Updated with Market Insights
              </p>
              <p>
                Track crop prices, understand market demand, and make data-driven decisions for your agricultural career.
              </p>
              <Link href="/student" className="mt-4 inline-block bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-50 transition">
                Access Student Module →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Section 5: Disease Detection & AI
  const DiseaseDetectionSection = () => (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          🔬 AI-Powered Disease Detection
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-lg p-12 text-white">
            <div className="text-6xl mb-6">🦠</div>
            <h3 className="text-2xl font-bold mb-4">Detect Crop Diseases Early</h3>
            <p className="mb-4">
              Use advanced AI technology to identify plant diseases from images and get immediate treatment recommendations.
            </p>
            <Link href="/disease-detection" className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-red-50 transition inline-block">
              Try Disease Detection →
            </Link>
          </div>
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">📸 Image Upload</h4>
              <p className="text-gray-700">Simply upload a photo of affected crop for instant analysis</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">⚡ Quick Results</h4>
              <p className="text-gray-700">Get disease identification and confidence levels instantly</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2">💊 Treatment Guide</h4>
              <p className="text-gray-700">Receive AI-powered treatment recommendations to save your crops</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );



  return (
    <div className="w-full min-h-screen bg-white">
      <HeroSection />
      <FarmerFeaturesSection />
      <BuyerFeaturesSection />
      <StudentModuleSection />
      <DiseaseDetectionSection />

    </div>
  );
}
