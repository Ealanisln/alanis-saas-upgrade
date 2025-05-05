import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

// Separate viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Metadata configuration with metadataBase
export const metadata = {
  metadataBase: new URL('https://alanis.dev'),
  title: "Alanis - Web Developer",
  description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://alanis.dev",
    title: "Alanis - Web Developer",
    description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alanis - Web Developer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="es" className="h-full">
      <head>
        <Script
          defer
          src="https://analytics-omega-nine.vercel.app/script.js"
          data-website-id="ff7f7fca-11fa-497f-814a-ee473d935868"
          strategy="afterInteractive"
        />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className} h-full`}>
        <Providers>
          <div className="flex min-h-[100dvh] flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Analytics />
            <Footer />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}