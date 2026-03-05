import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "./Providers";
import Header from "@/components/shared/Header";
import Footer from "@/components/Footer";

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
        <Providers>

          {/* Header */}
          <Header />

          {/* Page content */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
          />

        </Providers>
      </body>
    </html>
  );
}