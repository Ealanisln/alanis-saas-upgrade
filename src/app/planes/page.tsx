// src/app/planes/page.tsx
import Pricing from "@/components/Pricing";
import PricingHeader from "@/components/Pricing/PricingHeader";
import PricingFeatures from "@/components/Pricing/PricingFeatures";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alanis Developer | Planes y Precios",
  description:
    "Descubre los mejores planes para tu proyecto web, diseñados para satisfacer todas tus necesidades de desarrollo.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHeader />
      <PricingFeatures />

      <Pricing />

      <PricingFAQ />
    </>
  );
}
