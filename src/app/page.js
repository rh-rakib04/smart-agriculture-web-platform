"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "@/components/shared/Header";
import HeroSection from "@/components/Home/HeroSection";
import StatsBar from "@/components/Home/StatsBar";
import FarmerFeatures from "@/components/Home/Farmerfeatures";
import BuyerFeatures from "@/components/Home/BuyerFeatures";
import OurService from "@/components/Home/OurService";
import HowItWork from "@/components/Home/HowItWork";
import AIChatbotHighlight from "@/components/Home/Aichatbothighlight";
import PlannerHighlight from "@/components/Home/Plannerhighlight";
import WeatherHighlight from "@/components/Home/Weatherhighlight";
import StudentSection from "@/components/Home/Studentsection";
import NewsTeaser from "@/components/Home/Newsteaser";
import AboutUs from "@/components/Home/AboutUs";
import CTASection from "@/components/Home/CTASection";

import Loader from "@/components/Loader";

export default function HomePage() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">

      {loading ? (

        <Loader key="loader" />

      ) : (

        <motion.div
          key="homepage"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full min-h-screen bg-white"
        >

          <Header />
          <HeroSection />
          <StatsBar />
          <FarmerFeatures />
          <BuyerFeatures />
          <OurService />
          <HowItWork />
          <AIChatbotHighlight />
          <PlannerHighlight />
          <WeatherHighlight />
          <StudentSection />
          <NewsTeaser />
          <AboutUs />
          <CTASection />

        </motion.div>

      )}

    </AnimatePresence>
  );
}