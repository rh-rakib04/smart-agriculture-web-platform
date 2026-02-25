'use client';

/**
 * Header Component - Main navigation and branding
 * Displays platform name, user info, and navigation links
 */

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // BACKEND PLACEHOLDER - User authentication data to be fetched from backend
  const user = {
    name: 'Rajesh Kumar',
    role: 'Farmer',
    avatar: '👨‍🌾',
  };

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
              <span className="text-2xl">🌾</span>
              <h1 className="text-xl font-bold">SmartAgri</h1>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-green-100 transition">
              Home
            </Link>
            <Link href="/farmer" className="hover:text-green-100 transition">
              Farmer
            </Link>
            <Link href="/buyer" className="hover:text-green-100 transition">
              Buyer
            </Link>
            <Link href="/news" className="hover:text-green-100 transition">
              News
            </Link>
            <Link href="/weather" className="hover:text-green-100 transition">
              Weather
            </Link>
          </nav>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-green-700 px-3 py-2 rounded-lg transition"
            >
              <span className="text-2xl">{user.avatar}</span>
              <div className="text-left">
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-green-100">{user.role}</p>
              </div>
              <span className="text-sm">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  👤 Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  ⚙️ Settings
                </Link>
                {/* BACKEND PLACEHOLDER - Logout functionality to be implemented with authentication */}
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
