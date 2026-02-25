import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { AuthModalProvider } from "@/components/auth/AuthModal";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Alpha Result — PYQ & Solutions",
  description: "Past year questions, solutions and study tools for university students",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <AuthModalProvider>
            <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
              <Navbar />
            </div>

            <main className="flex-1">
              <div className="container py-10">
                {children}
              </div>
            </main>

            <Footer />
          </AuthModalProvider>
        </AuthProvider>

        {/* Vercel - Analytics */}
        <Analytics />

        {/* Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
