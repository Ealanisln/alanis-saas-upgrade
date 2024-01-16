import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Checkout stripe | Next.js + TypeScript Example",
};

export default function DonatePage(): JSX.Element {
  return (
    <div className="page-container">
        <div className="py-32 text-center">
      <h1>Donate with Checkout</h1>
      <p>Donate to our project 💖</p>
      {/* <CheckoutForm /> */}
      </div>
    </div>
  );
}
