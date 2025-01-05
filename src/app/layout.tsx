import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";
import { Providers } from "./providers";
import SessionWrapper from "@/components/Session/SessionWrapper";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <html suppressHydrationWarning lang="en">
        {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        <head />

        <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
          <Providers>
            <Header />
            {children}
            <Analytics />
            <Footer />
            <ScrollToTop />
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}
