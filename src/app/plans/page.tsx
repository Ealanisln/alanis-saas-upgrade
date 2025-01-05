import Pricing from "@/components/Pricing";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Alanis | Web Developer",
  description: "The best plans for your needs on web development."
};

export default function PricingPage() {
  return (
    <Pricing />
  );
}