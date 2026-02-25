'use client';

/**
 * Farmer Dashboard Page - Main farmer interface
 * Displays overview of all farmer management features
 */

import { useState } from 'react';
import { motion } from 'framer-motion';


import CropCard from '@/components/farmer/CropCard';
import ExpenseTracker from '@/components/farmer/ExpenseTracker';
import WeatherDisplay from '@/components/farmer/WeatherDisplay';
import AIRecommendations from '@/components/farmer/AIRecommendations';
import PlannerCalendar from '@/components/farmer/PlannerCalendar';
import { farmerMockData } from '@/data/mockData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';



export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { farmer, crops, expenses, weather, aiRecommendations, calendarEvents } = farmerMockData;

  // Calculate statistics
  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const activeCrops = crops.filter((c) => c.status === 'Growing').length;
  const avgHealth = Math.round(crops.reduce((sum, crop) => sum + (crop.health || 0), 0) / crops.length);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'crops', label: 'Crops', icon: '🌾' },
    { id: 'expenses', label: 'Expenses & Profit', icon: '💰' },
    { id: 'planning', label: 'Planning', icon: '📅' },
  ];

  return (
    <div className="flex w-full">
      <main className="flex-1 p-4 md:p-8 bg-green-50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-bold text-green-900 flex items-center space-x-3 mb-2">
              <span className="text-5xl">{farmer.avatar}</span>
              <span>Welcome, {farmer.name}</span>
            </h1>
            <p className="text-gray-600">
              Manage your farm efficiently with real-time insights and recommendations
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-gray-300">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-t-lg font-semibold transition-all
                  ${
                    activeTab === tab.id
                      ? 'bg-green-800 text-white'
                      : 'bg-white text-green-800 hover:bg-green-50'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Overview Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <StatCard
                  icon="🌾"
                  label="Total Crops"
                  value={crops.length}
                  trendUp={true}
                />
                <StatCard
                  icon="📊"
                  label="Active Crops"
                  value={activeCrops}
                  unit="Growing"
                  trendUp={true}
                />
                <StatCard
                  icon="📈"
                  label="Avg Health"
                  value={avgHealth}
                  unit="%"
                  trendUp={true}
                />
                <StatCard
                  icon="🌍"
                  label="Total Area"
                  value={totalArea}
                  unit="hectares"
                />
              </motion.div>

              {/* Quick Info Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Farm Information" icon="🏡">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold">{farmer.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-semibold">{farmer.yearsOfExperience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-semibold">{totalArea} hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-semibold">June 2024</span>
                    </div>
                  </div>
                </Card>

                <Card title="Quick Actions" icon="⚡">
                  <div className="space-y-2">
                    {/* BACKEND PLACEHOLDER - Action handlers to be implemented */}
                    <Button variant="primary" className="w-full">
                      ➕ Add New Crop
                    </Button>
                    <Button variant="secondary" className="w-full">
                      📝 Log Expense
                    </Button>
                    <Button variant="outline" className="w-full">
                      💬 Message Buyer
                    </Button>
                  </div>
                </Card>
              </div>

              {/* AI Recommendations Preview */}
              <AIRecommendations recommendations={aiRecommendations.slice(0, 2)} />

              {/* Weather Display */}
              <WeatherDisplay weatherData={weather} />
            </motion.div>
          )}

          {/* Crops Tab */}
          {activeTab === 'crops' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800">Your Crops</h2>
                {/* BACKEND PLACEHOLDER - Add crop functionality to be implemented */}
                <Button variant="primary">+ Add New Crop</Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <ExpenseTracker expenses={expenses} income={500000} />
            </div>
          )}

          {/* Planning Tab */}
          {activeTab === 'planning' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PlannerCalendar events={calendarEvents} />
                </div>
                <Card title="Planning Tips" icon="💡">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-green-800">🌾 Crop Rotation</p>
                      <p className="text-gray-600">Rotate crops to maintain soil health</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">💧 Irrigation</p>
                      <p className="text-gray-600">Schedule based on weather forecast</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">🐛 Pest Management</p>
                      <p className="text-gray-600">Plan preventive measures in advance</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
