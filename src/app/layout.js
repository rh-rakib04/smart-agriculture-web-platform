import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoTranslate from "./AutoTranslate";
import { Providers } from "./Providers";
import Header from "@/components/shared/Header";
import Footer from "@/components/Footer";
import I18nProvider from "./i18n-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Agriculture Platform",
  description: "Smart agriculture solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <I18nProvider>
            {" "}
            <AutoTranslate />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
            />
          </I18nProvider>
        </Providers>
      </body>


      
    </html>









  );
}