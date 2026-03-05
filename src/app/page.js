"use client";

/**
 * HomePage - Comprehensive landing page showcasing the Smart Agriculture Platform
 * Features 10 main sections with information about all platform capabilities
 * With Framer Motion animations and interactive carousel
 */
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import OurService from "@/components/Home/OurService";
import HowItWork from "@/components/Home/HowItWork";
import AboutUs from "@/components/Home/AboutUs";
import HeroSection from "@/components/Home/HeroSection";
import StatsBar from "@/components/Home/StatsBar";
import FarmerFeatures from "@/components/Home/Farmerfeatures";
import BuyerFeatures from "@/components/Home/BuyerFeatures";
import AIChatbotHighlight from "@/components/Home/Aichatbothighlight";
import PlannerHighlight from "@/components/Home/Plannerhighlight";
import WeatherHighlight from "@/components/Home/Weatherhighlight";
import StudentSection from "@/components/Home/Studentsection";
import NewsTeaser from "@/components/Home/Newsteaser";
import CTASection from "@/components/Home/CTASection";
import Header from "@/components/shared/Header";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <HeroSection />
      <StatsBar></StatsBar>
      <FarmerFeatures />
      <BuyerFeatures></BuyerFeatures>
      <OurService></OurService>
      <HowItWork></HowItWork>
      <AIChatbotHighlight></AIChatbotHighlight>
      <PlannerHighlight></PlannerHighlight>
      <WeatherHighlight></WeatherHighlight>
      <StudentSection></StudentSection>
      <NewsTeaser></NewsTeaser>
      <AboutUs></AboutUs>
      <CTASection></CTASection>
    </div>
  );
}
