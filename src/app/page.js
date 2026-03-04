'use client';

/**
 * HomePage - Comprehensive landing page showcasing the Smart Agriculture Platform
 * Features 10 main sections with information about all platform capabilities
 * With Framer Motion animations and interactive carousel
 */
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Crop carousel data
const CROPS_DATA = [
  { name: "Wheat", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef" },
  { name: "Corn", image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716" },
  { name: "Carrot", image: "https://images.unsplash.com/photo-1447175008436-170170d0e979" },
  { name: "Lettuce", image: "https://images.unsplash.com/photo-1582515073490-dc5b3a3d1f6d" },
  { name: "Tomato", image: "https://images.unsplash.com/photo-1592928302636-c83cf1cda3a0" },
];

// Section 1: Hero Section with Carousel
const HeroSection = ({ currentCrop }) => (
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
const FarmerFeaturesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
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
              <motion.div className="text-4xl mb-4">
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
};


// Section 3: Buyer Dashboard Features
const BuyerFeaturesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
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
              <motion.div className="text-4xl mb-4">
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
};

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

// Section 6: Weather & Planning
const WeatherPlanningSection = () => (
  <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
    <div className="max-w-7xl mx-auto w-full">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
        🌤️ Weather Prediction & Smart Planning
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-4xl mb-4">🌞</div>
          <h3 className="text-xl font-bold mb-4 text-gray-900">Weather Forecasts</h3>
          <p className="text-gray-700 mb-4">
            Get accurate 10-day weather predictions with:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Real-time temperature and humidity</li>
            <li>• Wind speed and rainfall predictions</li>
            <li>• Agricultural alerts and warnings</li>
            <li>• Farming recommendations based on weather</li>
          </ul>
          <Link href="/weather" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">
            Check Weather →
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-4 text-gray-900">Smart Planner Calendar</h3>
          <p className="text-gray-700 mb-4">
            Organize your farming activities with:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Schedule planting dates</li>
            <li>• Track harvesting timelines</li>
            <li>• Plan maintenance activities</li>
            <li>• Set important farming reminders</li>
          </ul>
          <Link href="/farmer" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition">
            Access Planner →
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Section 7: Harvest Calculator
const HarvestCalculatorSection = () => (
  <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto w-full">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
        📊 Harvest Prediction & Revenue Calculator
      </h2>
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold mb-2">Yield Estimation</h3>
            <p>Calculate expected crop yield based on inputs and conditions</p>
          </div>
          <div>
            <div className="text-5xl mb-4">💵</div>
            <h3 className="text-2xl font-bold mb-2">Revenue Projection</h3>
            <p>Estimate potential income and ROI for your crops</p>
          </div>
          <div>
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-2xl font-bold mb-2">Market Analysis</h3>
            <p>Compare prices and market trends for better decisions</p>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link href="/harvest-calculator" className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition inline-block">
            Use Harvest Calculator →
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Section 8: News & Updates
const NewsSection = () => (
  <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="max-w-7xl mx-auto w-full">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
        📰 Latest Agricultural News
      </h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-bold text-lg mb-2">Policy Updates</h3>
          <p className="text-gray-700 text-sm">Stay informed about government policies and agricultural reforms</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-bold text-lg mb-2">Technology News</h3>
          <p className="text-gray-700 text-sm">Discover emerging technologies transforming agriculture</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
          <div className="text-3xl mb-3">🔬</div>
          <h3 className="font-bold text-lg mb-2">Research Updates</h3>
          <p className="text-gray-700 text-sm">Learn about latest agricultural research and innovations</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-600">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-bold text-lg mb-2">Market Reports</h3>
          <p className="text-gray-700 text-sm">Track market trends and price movements</p>
        </div>
      </div>
      <div className="text-center">
        <Link href="/news" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition inline-block">
          Read All News →
        </Link>
      </div>
    </div>
  </section>
);

// Section 9: Platform Capabilities
const CapabilitiesSection = () => (
  <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto w-full">
      <motion.h2
        className="text-4xl font-bold text-center mb-12 text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        ⚡ Why Choose SmartAgri?
      </motion.h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '🤖', title: 'AI-Powered', desc: 'Intelligent recommendations' },
          { icon: '📊', title: 'Data Driven', desc: 'Real-time analytics' },
          { icon: '🔗', title: 'Connected', desc: 'Farmers & buyers together' },
          { icon: '📱', title: 'User Friendly', desc: 'Easy to navigate' },
          { icon: '🎓', title: 'Educational', desc: 'Learn & grow' },
          { icon: '💰', title: 'Cost Effective', desc: 'Maximize profits' },
          { icon: '🌍', title: 'Sustainable', desc: 'Eco-friendly farming' },
          { icon: '🔒', title: 'Secure', desc: 'Safe transactions' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="text-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08, rotate: 2 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, delay: idx * 0.2, repeat: Infinity }}
            >
              {item.icon}
            </motion.div>
            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Section 10: Call to Action
const CTASection = () => (
  <section className="w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Animated background elements */}
    <motion.div
      className="absolute top-0 left-0 text-9xl opacity-10"
      animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
      transition={{ duration: 15, repeat: Infinity }}
    >
      🌾
    </motion.div>
    <motion.div
      className="absolute bottom-0 right-0 text-9xl opacity-10"
      animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
      transition={{ duration: 12, delay: 3, repeat: Infinity }}
    >
      🚜
    </motion.div>

    <div className="max-w-4xl mx-auto text-center w-full relative z-10">
      <motion.h2
        className="text-4xl sm:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Ready to Transform Your Agriculture?
      </motion.h2>
      <motion.p
        className="text-xl text-green-100 mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Join thousands of farmers and buyers using SmartAgri to grow their business and make data-driven decisions.
      </motion.p>
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link href="/farmer" className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition shadow-lg">
            👨‍🌾 Start as Farmer
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link href="/buyer" className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition border-2 border-white shadow-lg">
            👨‍💼 Start as Buyer
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link href="/student" className="inline-block bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-700 transition border-2 border-white shadow-lg">
            👨‍🎓 Student Access
          </Link>
        </motion.div>
      </motion.div>
      <motion.p
        className="text-green-100 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        💡 Questions? Visit our news section or contact support for more information.
      </motion.p>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="w-full bg-gray-900 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center w-full">
      <p className="mb-4">
        © 2024 SmartAgri - Modern Agriculture Platform | Empowering Farmers, Connecting Communities
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        <Link href="/news" className="hover:text-white transition">News</Link>
        <Link href="/weather" className="hover:text-white transition">Weather</Link>
        <Link href="/messages" className="hover:text-white transition">Messages</Link>
        <Link href="/payment" className="hover:text-white transition">Payment</Link>
      </div>
    </div>
  </footer>
);

export default function HomePage() {
  const [currentCrop, setCurrentCrop] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCrop((prev) => (prev + 1) % CROPS_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <HeroSection currentCrop={currentCrop} />
      <FarmerFeaturesSection />
      <BuyerFeaturesSection />
      <StudentModuleSection />
      <DiseaseDetectionSection />
      <WeatherPlanningSection />
      <HarvestCalculatorSection />
      <NewsSection />
      <CapabilitiesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

