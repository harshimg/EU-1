import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { AuthModalProvider } from "@/components/auth/AuthModal";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Alpha Result - PYQs, Solutions, Results & SGPA Calculator",
  description: "AlphaResult helps BEU students access PYQs, Solutions, check results, and calculate SGPA easily.",
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
        {/* Google Ads */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2796700167884172"
        crossOrigin="anonymous"></script>

     
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


        {/* Structured Data */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Alpha Result",
              url: "https://alpharesult.in",
              description:
                "BEU Previous Year Questions with Solutions and SGPA CGPA Calculator.",
            }),
          }}
        />


        {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-PC5PLZKLXR"
            strategy="afterInteractive"
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PC5PLZKLXR');
            `}
          </Script>

        {/*Vercel - Analytics */}
        <Analytics />

        {/* Speed Insights */}
        <SpeedInsights />

      </body>
    </html>
  );
}
