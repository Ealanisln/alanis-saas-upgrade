import PrintObject from "@/components/Checkout/PrintObject";
import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import type { JSX } from "react";

const PlanDetails = async ({
  searchParams,
}: {
  searchParams: { session_id: string };
}): Promise<JSX.Element> => {
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  return (
    <>
      <div className="w-full">
        <div
          className="wow fadeInUp relative z-10 rounded-sm bg-white px-8 py-10 shadow-three hover:shadow-one dark:bg-gray-dark dark:shadow-two dark:hover:shadow-gray-dark"
          data-wow-delay=".1s"
        >
          <h2 className="pb-8 text-xl font-semibold">Order details </h2>
          <PrintObject content={checkoutSession} />
        </div>
      </div>
    </>
  );
};

export default PlanDetails;
