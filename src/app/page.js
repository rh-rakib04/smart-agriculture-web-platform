import AboutUs from "@/components/Home/AboutUs";
import Banner from "@/components/Home/Banner";
import HowItWork from "@/components/Home/HowItWork";
import MissionVision from "@/components/Home/MissionVision";
import OurService from "@/components/Home/OurService";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* banner */}

      <Banner></Banner>

      {/* About Us */}
      <AboutUs></AboutUs>

      {/* Our Mission & Vision */}

     <MissionVision></MissionVision>

     {/*  */}
      <OurService></OurService>

      {/* How It Works */}

      <HowItWork></HowItWork>
      {/*  */}
    </div>
  );
}
