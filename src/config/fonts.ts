import { Geist, JetBrains_Mono } from "next/font/google";

export const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

export const geistBody = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = [
  geistSans.variable,
  geistBody.variable,
  jetbrainsMono.variable,
].join(" ");
