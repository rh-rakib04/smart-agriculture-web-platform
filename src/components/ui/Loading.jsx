"use client";

import Lottie from "lottie-react";
// Option: Move your JSON to src/assets/nature-loader.json 
// OR use a hosted URL for testing
const LOTTIE_URL = "https://assets9.lottiefiles.com/packages/lf20_m6cu96ze.json"; // A subtle leaf/nature grow

export default function Loading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end pb-4 border-b" style={{ borderColor: "var(--bg)" }}>
        <div className="space-y-3">
          <div className="h-10 w-48 rounded-lg" style={{ backgroundColor: "var(--secondary)", opacity: 0.2 }}></div>
          <div className="h-4 w-64 rounded-lg" style={{ backgroundColor: "var(--accent)", opacity: 0.1 }}></div>
        </div>
        <div className="h-10 w-32 rounded-lg" style={{ backgroundColor: "var(--primary)", opacity: 0.2 }}></div>
      </div>

      {/* Floating Lottie Overlay - Makes it feel "Modern" */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[2px]">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32">
              <Lottie path={LOTTIE_URL} loop={true} />
            </div>
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "var(--primary)" }}>
              Analyzing Ecosystem
            </p>
          </div>
        </div>

        {/* Table Skeleton Rows */}
        <table className="w-full">
          <thead style={{ backgroundColor: "var(--bg)" }}>
            <tr>
              {Array(4).fill(0).map((_, i) => (
                <th key={i} className="px-6 py-4"><div className="h-4 w-20 rounded bg-gray-200"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="px-6 py-6"><div className="h-5 w-40 rounded bg-gray-100"></div></td>
                <td className="px-6 py-6"><div className="h-8 w-24 rounded-lg bg-gray-100"></div></td>
                <td className="px-6 py-6"><div className="h-6 w-16 rounded-full bg-gray-100"></div></td>
                <td className="px-6 py-6 text-right"><div className="h-9 w-28 rounded-lg bg-gray-100 ml-auto"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center px-2">
        <div className="h-10 w-24 rounded-lg bg-gray-200"></div>
        <div className="h-10 w-40 rounded-full bg-gray-200"></div>
        <div className="h-10 w-24 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
}