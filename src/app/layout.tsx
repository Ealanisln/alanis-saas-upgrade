import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// Updated viewport configuration for better iOS Safari handling
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Get the locale from the headers set by middleware
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Add meta tag specifically for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0F172A"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`bg-[#FCFCFC] dark:bg-black ${inter.className} overflow-x-hidden text-body-color antialiased`}
      >
        <Script
          defer
          src="https://analytics-omega-nine.vercel.app/script.js"
          data-website-id="ff7f7fca-11fa-497f-814a-ee473d935868"
          strategy="afterInteractive"
        />

        <Providers>
          <div className="flex min-h-[100dvh] flex-col">
            {children}
            <Analytics />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
