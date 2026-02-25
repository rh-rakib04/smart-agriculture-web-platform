import AboutUs from "@/component/Home/AboutUs";
import Banner from "@/component/Home/Banner";
import HowItWork from "@/component/Home/HowItWork";
import MissionVision from "@/component/Home/MissionVision";
import OurService from "@/component/Home/OurService";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* banner */}

      {/* <Banner></Banner> */}

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
