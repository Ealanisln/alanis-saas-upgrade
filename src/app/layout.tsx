import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
  // Get the locale from the cookie set by middleware
  // Cookies are more reliably accessible in server components than headers
  const cookieStore = await cookies();
  const locale = cookieStore.get("x-locale")?.value || "en";

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

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
