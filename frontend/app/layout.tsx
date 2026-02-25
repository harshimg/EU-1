import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { AuthModalProvider } from "@/components/auth/AuthModal";

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Alpha Result — PYQ & Solutions",
  description: "Study tools & past year questions",
  icons: {
    // icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        {/* <title> Alpha Result</title> */}
      </head>
      <body className="bg-[#F9FAFF] min-h-screen">

        <AuthProvider>
          <AuthModalProvider>
            
            {/* MAIN LAYOUT */}
            <div className="flex flex-col min-h-screen">

              {/* NAVBAR */}
              <Navbar />

              {/* PAGE CONTENT */}
              <main className="flex-1">
                {/* <div className="container py-10">{children}</div> */}
                {children}
              </main>

              {/* FOOTER */}
              <Footer />
            </div>


          </AuthModalProvider>
        </AuthProvider>

        {/*Vercel - Analytics */}
        <Analytics />

        {/* Speed Insights */}
        <SpeedInsights />

      </body>
    </html>
  );
}
