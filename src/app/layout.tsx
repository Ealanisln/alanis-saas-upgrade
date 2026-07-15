import { cookies } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { fontVariables, geist } from "@/config/fonts";
import "../styles/index.css";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://alanis.dev",
  ),
};

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

  // Font variables live on <html> so Tailwind's :root-level @theme tokens
  // (--font-heading/--font-body/--font-mono) can resolve them
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`scroll-smooth ${fontVariables}`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Kept in sync with the active next-themes class by Nav — the theme
            is class-based (system detection off), so an OS-preference media
            query here would mismatch the rendered page */}
        <meta name="theme-color" content="#F7F8FA" />
      </head>
      <body className={`${geist.className} overflow-x-hidden antialiased`}>
        <Script
          defer
          src="https://analytics.alanis.dev/script.js"
          data-website-id="ff7f7fca-11fa-497f-814a-ee473d935868"
          strategy="afterInteractive"
        />

        <Providers>
          <div className="flex min-h-[100dvh] flex-col">
            {children}
            <Analytics />
          </div>
        </Providers>
      </body>
    </html>
  );
}
