import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthProvider";

import Header from "@/components/shared/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartAgri",
  description: "Smart Agriculture Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          
          {/* Global Navbar */}
          <Header />

          {/* Page Content */}
          <main className="w-full min-h-screen">
            {children}
          </main>

        </AuthProvider>

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </body>
    </html>
  );
}