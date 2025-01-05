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
    <div className="py-32">
      <div className="container">
      <SectionTitle
            title="Your order was confirmed!"
            paragraph="Thank you for your support. Within 24 hours or less, you will be contacted to initiate work on your project."
            center
          />
      {children}
      </div>
    </div>
  );
}
