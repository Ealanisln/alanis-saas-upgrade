import SectionTitle from "@/components/Common/SectionTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Session Result",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="py-8 md:py-20 lg:py-28">
      <div className="container pt-12">
      <SectionTitle
            title="Your order was confirmed!"
            paragraph="Thank you for your support. In a 24 hours or less you will be contacted in order to start working on your project"
            center
          />
      {children}
      </div>
    </div>
  );
}
