import Script from "next/script";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import ScrollToTop from "@/components/ScrollToTop";
import { fontVariables, ibmPlexSans } from "@/config/fonts";
import "../styles/index.css";
import { Providers } from "./providers";

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
  const cookieStore = await cookies();
  const locale = cookieStore.get("x-locale")?.value || "en";

  return (
    <html lang={locale} suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0D1117"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`${fontVariables} ${ibmPlexSans.className} overflow-x-hidden antialiased`}
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
