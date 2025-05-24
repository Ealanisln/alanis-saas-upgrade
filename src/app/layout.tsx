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

// Updated viewport configuration for better iOS Safari handling
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// Dynamic metadata configuration that adapts to environment
const getMetadataBase = () => {
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.NODE_ENV === 'development') {
    return new URL('http://localhost:3000');
  }
  return new URL('https://www.alanis.dev');
};

export const metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Alanis - Web Developer",
    template: "%s | Alanis Dev"
  },
  description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
  keywords: ["desarrollo web", "programación", "javascript", "typescript", "react", "next.js", "full-stack"],
  authors: [{ name: "Alanis Dev" }],
  creator: "Alanis Dev",
  publisher: "Alanis Dev",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Alanis Dev",
    title: "Alanis - Web Developer",
    description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Alanis - Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alanis - Web Developer",
    description: "Desarrollador full-stack especializado en crear aplicaciones web robustas, escalables y fáciles de usar.",
    images: ["/opengraph-image"],
    creator: "@alanisdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "verification_token", // Replace with your actual verification token
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="es" className="scroll-smooth">
      <head>
        <Script
          defer
          src="https://analytics-omega-nine.vercel.app/script.js"
          data-website-id="ff7f7fca-11fa-497f-814a-ee473d935868"
          strategy="afterInteractive"
        />
        {/* Add meta tag specifically for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className} antialiased text-body-color overflow-x-hidden`}>
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