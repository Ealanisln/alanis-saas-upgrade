import Pricing from "@/components/Pricing";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Checkout stripe | Next.js + TypeScript Example",
};

export default function DonatePage(): JSX.Element {
  return (
    <Pricing />
  );
}
