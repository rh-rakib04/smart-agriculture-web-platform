'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';


import { useAuth } from "@/hooks/useAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useAuthContext } from "@/contexts/AuthProvider";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthContext();
   console.log(user);
  const pathname = usePathname();

  // 1. Define the routes where the header should NOT appear
  const hiddenRoutes = ['/login', '/register'];

  // 2. If the current URL is in the hiddenRoutes array, render nothing
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  // 3. Handle the logout process and close the dropdown
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false); 
  };

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          
       
          <a href="/">
            <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
              <Image 
                src="/logo.png"
                alt="Logo"
                width={80}
                height={40}
              />
              <h1 className="text-xl font-bold">SmartAgri</h1>
            </div>
          </a>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-green-100 transition">Home</Link>
            <Link href="/farmer" className="hover:text-green-100 transition">Farmer</Link>
            <Link href="/buyer" className="hover:text-green-100 transition">Buyer</Link>
            <Link href="/news" className="hover:text-green-100 transition">News</Link>
            <Link href="/weather" className="hover:text-green-100 transition">Weather</Link>
          </nav>

          {/* Authentication Section (Conditional Rendering) */}
          <div className="flex items-center">
            {user ? (
             
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-green-700 px-3 py-2 rounded-lg transition"
                >
                  <span className="text-2xl">{user.avatar || '👤'}</span>
                  <div className="text-left hidden md:block">
                    <p className="font-semibold text-sm">{user.name || 'User'}</p>
                    <p className="text-xs text-green-100">{user.role || 'Member'}</p>
                  </div>
                  <span className="text-sm">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-10">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // -------- LOGGED OUT STATE: Show Login/Register Buttons --------
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="font-medium hover:text-green-200 transition hidden sm:block"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 bg-white text-green-800 rounded-lg font-bold hover:bg-green-50 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}