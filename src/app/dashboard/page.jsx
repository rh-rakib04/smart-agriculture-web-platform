
import React from "react";
import StatCard from "@/components/ui/StarCard";
import WeatherCard from "@/components/dashboard/WeatherCard";
import TasksCard from "@/components/dashboard/TasksCard";
import MarketOverview from "@/components/dashboard/MarketOverview";
import AlertsCard from "@/components/dashboard/AlertsCard";


const page = () => {
  
  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
     hello vai
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Yield" value="1.2 Tons" trend="+8%" />
        <StatCard title="Today's Temp" value="29°C" trend="-2%" />
        <StatCard title="Soil Moisture" value="62%" trend="+5%" />
        <StatCard title="Alerts" value="3" trend="Attention" danger />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeatherCard />
       <MarketOverview></MarketOverview>
      </section>

      {/* SECONDARY GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TasksCard></TasksCard>
        <AlertsCard></AlertsCard>
      </section>
      
      
    </div>
  );
};

export default page;
