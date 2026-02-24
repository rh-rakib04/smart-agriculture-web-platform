"use client";

import ChatCard from "./components/ChatCard";
import SuggestionCard from "./components/SuggestionCard";
import TitleCard from "./components/TitleCard";
import WeatherCard from "./components/WeatherCard";

export default function Page() {
  return (
    <div className="max-w-screen min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 p-6">

      {/* Center Container */}
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <div className="mb-8 text-center">
          <TitleCard />
        </div>

        {/* Dashboard Grid */}
        <div className="flex justify-around gap-1 flex-col ">

          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <WeatherCard />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <ChatCard />
          </div>

        </div>

      </div>
    </div>
  );
}