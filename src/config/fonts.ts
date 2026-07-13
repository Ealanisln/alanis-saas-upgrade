import { Geist, JetBrains_Mono } from "next/font/google";

// One Geist instance serves both headings and body (identical weights) so
// Next emits a single @font-face/preload set instead of two duplicates.
export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = [geist.variable, jetbrainsMono.variable].join(" ");
